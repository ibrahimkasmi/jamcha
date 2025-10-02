// PodcastServiceImpl
package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.PodcastRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.PodcastResponseDto;
import ma.jamcha.jamcha.entities.Podcast;
import ma.jamcha.jamcha.mappers.PodcastMapper;
import ma.jamcha.jamcha.repositories.PodcastRepository;
import ma.jamcha.jamcha.services.MinioService;
import ma.jamcha.jamcha.services.PodcastService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PodcastServiceImpl implements PodcastService {

    private final PodcastRepository podcastRepository;
    private final PodcastMapper podcastMapper;
    private final MinioService minioService;

    @Override
    public List<PodcastResponseDto> getAll() {
        return podcastRepository.findAll().stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PodcastResponseDto getById(Long id) {
        Podcast podcast = podcastRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + id));
        return podcastMapper.toDto(podcast);
    }

    @Override
    public PodcastResponseDto create(PodcastRequestDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required.");
        }

        String slug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (podcastRepository.existsBySlug(slug)) {
            throw new RuntimeException("A podcast with this slug already exists: " + slug);
        }

        Podcast podcast = podcastMapper.toEntity(dto);
        podcast.setSlug(slug);
        podcast.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now());
        podcast.setFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        podcast.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");

        // Auto-generate thumbnail from YouTube if not provided
        if (podcast.getThumbnailUrl() == null || podcast.getThumbnailUrl().isEmpty()) {
            podcast.setThumbnailUrl(generateYouTubeThumbnail(dto.getVideoUrl()));
        }

        Podcast saved = podcastRepository.save(podcast);
        return podcastMapper.toDto(saved);
    }

    @Override
    public PodcastResponseDto update(Long id, PodcastRequestDto dto) {
        Podcast existing = podcastRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + id));

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (!newSlug.equals(existing.getSlug()) && podcastRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another podcast with this slug already exists: " + newSlug);
        }

        podcastMapper.updatePodcastFromDto(dto, existing);
        existing.setSlug(newSlug);

        Podcast updated = podcastRepository.save(existing);
        return podcastMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        Podcast podcast = podcastRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + id));

        // Delete associated thumbnail from MinIO if it's a custom upload
        if (podcast.getThumbnailUrl() != null && !podcast.getThumbnailUrl().contains("img.youtube.com")) {
            try {
                deletePodcastThumbnail(podcast.getThumbnailUrl());
            } catch (Exception e) {
                System.err.println("Failed to delete podcast thumbnail: " + e.getMessage());
            }
        }

        podcastRepository.deleteById(id);
    }

    @Override
    public PodcastResponseDto findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Slug cannot be null or empty");
        }

        Podcast podcast = podcastRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Podcast not found with slug: " + slug));

        return podcastMapper.toDto(podcast);
    }

    @Override
    public List<PodcastResponseDto> getByLanguage(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Podcast> page = podcastRepository.findByLanguageOrderByPublishedAtDesc(language, pageable);
        return page.getContent().stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PodcastResponseDto> getFeaturedByLanguage(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        Page<Podcast> featuredPage = podcastRepository.findByLanguageAndFeaturedTrue(language, pageable);
        List<Podcast> podcasts = featuredPage.getContent();

        if (podcasts.isEmpty()) {
            Page<Podcast> latestPage = podcastRepository.findByLanguageOrderByPublishedAtDesc(language, pageable);
            podcasts = latestPage.getContent();
        }

        return podcasts.stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PodcastResponseDto> getByLanguageAndCategory(String language, int limit, String category) {
        Pageable pageable = PageRequest.of(0, limit);

        List<Podcast> podcasts;
        if (category != null && !category.isBlank() && !category.equals("all")) {
            Page<Podcast> page = podcastRepository.findByLanguageAndCategorySlug(language, category, pageable);
            podcasts = page.getContent();
        } else {
            podcasts = podcastRepository.findByLanguageOrderByPublishedAtDesc(language, pageable).getContent();
        }

        return podcasts.stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PodcastResponseDto> searchByTitleOrDescription(String query, String language) {
        List<Podcast> podcasts = podcastRepository.findByLanguageAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                language, query, query);

        return podcasts.stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void incrementViewCount(Long podcastId) {
        podcastRepository.incrementViewCount(podcastId);
    }

    @Override
    public List<PodcastResponseDto> getMostViewed(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Podcast> page = podcastRepository.findByLanguageOrderByViewCountDesc(language, pageable);
        return page.getContent().stream()
                .map(podcastMapper::toDto)
                .collect(Collectors.toList());
    }

    // Thumbnail upload methods
    private String uploadPodcastThumbnail(MultipartFile thumbnailFile, String podcastSlug) throws Exception {
        String originalFilename = thumbnailFile.getOriginalFilename();
        String fileExtension = "";
        String filename = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            filename = originalFilename.substring(0, originalFilename.indexOf("."));
        }

        String uniqueFilename = "podcast_" + podcastSlug + "_" + UUID.randomUUID().toString() + fileExtension;
        minioService.uploadFile(uniqueFilename, thumbnailFile.getInputStream(),
                thumbnailFile.getContentType(), thumbnailFile.getSize());
        return uniqueFilename;
    }

    private void deletePodcastThumbnail(String filename) throws Exception {
        if (minioService.fileExists(filename)) {
            minioService.deleteFile(filename);
        }
    }

    @Override
    public PodcastResponseDto createWithThumbnail(PodcastRequestDto dto, MultipartFile thumbnailFile) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("The title is required");
        }

        String slug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (podcastRepository.existsBySlug(slug)) {
            throw new RuntimeException("A podcast with slug already exists");
        }

        Podcast podcast = podcastMapper.toEntity(dto);
        podcast.setSlug(slug);
        podcast.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now());
        podcast.setFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        podcast.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");
        System.out.println("=== THUMBNAIL DEBUG ===");
        System.out.println("thumbnailFile is null: " + (thumbnailFile == null));
        if (thumbnailFile != null) {
            System.out.println("thumbnailFile isEmpty: " + thumbnailFile.isEmpty());
            System.out.println("thumbnailFile size: " + thumbnailFile.getSize());
            System.out.println("thumbnailFile name: " + thumbnailFile.getOriginalFilename());
        }
        System.out.println("========================");

        // Handle thumbnail upload
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            try {
                String thumbnailFilename = uploadPodcastThumbnail(thumbnailFile, slug);
                podcast.setThumbnailUrl(thumbnailFilename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload podcast thumbnail: " + e.getMessage());
            }
        } else {
            // Auto-generate YouTube thumbnail if no custom thumbnail provided
            podcast.setThumbnailUrl(generateYouTubeThumbnail(dto.getVideoUrl()));
        }

        Podcast saved = podcastRepository.save(podcast);
        return podcastMapper.toDto(saved);
    }

    @Override
    public PodcastResponseDto updateWithThumbnail(Long id, PodcastRequestDto dto, MultipartFile thumbnailFile) {
        Podcast existing = podcastRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + id));

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (!newSlug.equals(existing.getSlug()) && podcastRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another podcast with same slug exists");
        }

        podcastMapper.updatePodcastFromDto(dto, existing);
        existing.setSlug(newSlug);
        // Delete old custom thumbnail if new one is provided
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            try {
                if (existing.getThumbnailUrl() != null && !existing.getThumbnailUrl().contains("img.youtube.com")) {
                    deletePodcastThumbnail(existing.getThumbnailUrl());
                }
            } catch (Exception e) {
                throw new RuntimeException("An error occurred during the deletion of the old thumbnail: " + e);
            }

            try {
                String newThumbnailFilename = uploadPodcastThumbnail(thumbnailFile, newSlug);
                existing.setThumbnailUrl(newThumbnailFilename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload new podcast thumbnail: " + e.getMessage(), e);
            }
        }


        Podcast updated = podcastRepository.save(existing);
        return podcastMapper.toDto(updated);
    }

    @Override
    public PodcastResponseDto updatePodcastThumbnail(Long podcastId, MultipartFile thumbnailFile) {
        Podcast podcast = podcastRepository.findById(podcastId)
                .orElseThrow(() -> new RuntimeException("No podcast found with id: " + podcastId));

        // Delete old custom thumbnail
        if (podcast.getThumbnailUrl() != null && !podcast.getThumbnailUrl().contains("img.youtube.com")) {
            try {
                deletePodcastThumbnail(podcast.getThumbnailUrl());
            } catch (Exception e) {
                throw new RuntimeException("An error occurred when deleting the old thumbnail: " + e);
            }
        }

        // Upload new thumbnail
        try {
            String newThumbnailFilename = uploadPodcastThumbnail(thumbnailFile, podcast.getSlug());
            podcast.setThumbnailUrl(newThumbnailFilename);
            Podcast updated = podcastRepository.save(podcast);
            return podcastMapper.toDto(updated);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred when uploading the new thumbnail: " + e);
        }
    }

    @Override
    public void deletePodcastThumbnail(Long podcastId) {
        Podcast podcast = podcastRepository.findById(podcastId)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + podcastId));

        if (podcast.getThumbnailUrl() == null) {
            throw new RuntimeException("Podcast has no thumbnail to delete");
        }

        // Don't delete YouTube auto-generated thumbnails
        if (podcast.getThumbnailUrl().contains("img.youtube.com")) {
            throw new RuntimeException("Cannot delete auto-generated YouTube thumbnail");
        }

        try {
            deletePodcastThumbnail(podcast.getThumbnailUrl());
            // Revert to YouTube thumbnail
            podcast.setThumbnailUrl(generateYouTubeThumbnail(podcast.getVideoUrl()));
            podcastRepository.save(podcast);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete the podcast thumbnail: " + e);
        }
    }

    @Override
    public Map<String, Object> getPodcastThumbnailInfo(Long podcastId) {
        Podcast podcast = podcastRepository.findById(podcastId)
                .orElseThrow(() -> new RuntimeException("Podcast not found with id: " + podcastId));

        if (podcast.getThumbnailUrl() == null) {
            throw new RuntimeException("Podcast has no thumbnail");
        }

        // Check if it's a custom uploaded thumbnail
        if (podcast.getThumbnailUrl().contains("img.youtube.com")) {
            Map<String, Object> response = new HashMap<>();
            response.put("podcastId", podcastId);
            response.put("thumbnailUrl", podcast.getThumbnailUrl());
            response.put("type", "youtube_auto_generated");
            return response;
        }

        try {
            var fileInfo = minioService.getFileInfo(podcast.getThumbnailUrl());
            Map<String, Object> response = new HashMap<>();
            response.put("podcastId", podcastId);
            response.put("filename", podcast.getThumbnailUrl());
            response.put("size", fileInfo.size());
            response.put("contentType", fileInfo.contentType());
            response.put("lastModified", fileInfo.lastModified());
            response.put("etag", fileInfo.etag());
            response.put("type", "custom_upload");
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get thumbnail file information: " + e);
        }
    }

    private String generateSlug(String title) {
        if (title == null) return null;
        return title.toLowerCase()
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-zA-Z0-9\\-]", "")
                .replaceAll("-+", "-");
    }

    private String generateYouTubeThumbnail(String videoUrl) {
        if (videoUrl == null || videoUrl.isEmpty()) return null;

        // Extract YouTube video ID
        String videoId = extractYouTubeId(videoUrl);
        if (videoId != null) {
            return "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg";
        }
        return null;
    }

    private String extractYouTubeId(String url) {
        String pattern = "(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^\"&?\\/\\s]{11})";
        java.util.regex.Pattern compiledPattern = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher matcher = compiledPattern.matcher(url);
        return matcher.find() ? matcher.group(1) : null;
    }
}