// PodcastService Interface
package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoRequest.PodcastRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.PodcastResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface PodcastService {

    List<PodcastResponseDto> getAll();

    PodcastResponseDto getById(Long id);

    PodcastResponseDto create(PodcastRequestDto dto);

    PodcastResponseDto update(Long id, PodcastRequestDto dto);

    // Create podcast with thumbnail image
    PodcastResponseDto createWithThumbnail(PodcastRequestDto dto, MultipartFile thumbnailFile);

    // Update podcast with thumbnail image
    PodcastResponseDto updateWithThumbnail(Long id, PodcastRequestDto dto, MultipartFile thumbnailFile);

    // Update just the podcast thumbnail
    PodcastResponseDto updatePodcastThumbnail(Long podcastId, MultipartFile thumbnailFile);

    // Delete the podcast thumbnail
    void deletePodcastThumbnail(Long podcastId);

    // Get the podcast thumbnail info
    Map<String, Object> getPodcastThumbnailInfo(Long podcastId);

    // Delete the entire podcast
    void delete(Long id);

    // Find by slug
    PodcastResponseDto findBySlug(String slug);

    // Get by language
    List<PodcastResponseDto> getByLanguage(String language, int limit);

    // Get featured podcasts by language
    List<PodcastResponseDto> getFeaturedByLanguage(String language, int limit);

    // Get by language and category
    List<PodcastResponseDto> getByLanguageAndCategory(String language, int limit, String category);

    // Search by title or description
    List<PodcastResponseDto> searchByTitleOrDescription(String query, String language);

    // Increment view count
    void incrementViewCount(Long podcastId);

    // Get most viewed podcasts
    List<PodcastResponseDto> getMostViewed(String language, int limit);
}
