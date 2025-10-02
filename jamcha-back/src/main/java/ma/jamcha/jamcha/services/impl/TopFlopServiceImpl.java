// TopFlopServiceImpl
package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.TopFlopRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TopFlopResponseDto;
import ma.jamcha.jamcha.entities.TopFlopEntry;
import ma.jamcha.jamcha.mappers.TopFlopMapper;
import ma.jamcha.jamcha.repositories.TopFlopRepository;
import ma.jamcha.jamcha.services.MinioService;
import ma.jamcha.jamcha.services.TopFlopService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TopFlopServiceImpl implements TopFlopService {

    private final TopFlopRepository topFlopRepository;
    private final TopFlopMapper topFlopMapper;
    private final MinioService minioService;

    @Override
    public List<TopFlopResponseDto> getCurrentWeekEntries(String language) {
        List<TopFlopEntry> entries = topFlopRepository.findCurrentWeekEntries(language);
        return entries.stream()
                .map(topFlopMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TopFlopResponseDto> getEntriesByWeek(LocalDate weekOf, String language) {
        List<TopFlopEntry> entries = topFlopRepository.findByWeekOfAndLanguageOrderByPositionAsc(weekOf, language);
        return entries.stream()
                .map(topFlopMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TopFlopResponseDto getById(Long id) {
        TopFlopEntry entry = topFlopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + id));
        return topFlopMapper.toDto(entry);
    }

    @Override
    public TopFlopResponseDto findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Slug cannot be null or empty");
        }

        TopFlopEntry entry = topFlopRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with slug: " + slug));

        return topFlopMapper.toDto(entry);
    }

    @Override
    public TopFlopResponseDto create(TopFlopRequestDto dto) {
        validateCreateRequest(dto);

        String slug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getPersonName());
        if (topFlopRepository.existsBySlug(slug)) {
            throw new RuntimeException("A TopFlop entry with this slug already exists: " + slug);
        }

        // Check position availability
        if (topFlopRepository.existsByWeekOfAndEntryTypeAndPosition(dto.getWeekOf(), dto.getEntryType(), dto.getPosition())) {
            throw new RuntimeException("Position " + dto.getPosition() + " is already taken for " + dto.getEntryType() + " in week " + dto.getWeekOf());
        }

        TopFlopEntry entry = topFlopMapper.toEntity(dto);
        entry.setSlug(slug);
        entry.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");

        TopFlopEntry saved = topFlopRepository.save(entry);
        return topFlopMapper.toDto(saved);
    }

    @Override
    public TopFlopResponseDto createWithImage(TopFlopRequestDto dto, MultipartFile imageFile) {
        validateCreateRequest(dto);

        String slug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getPersonName());
        if (topFlopRepository.existsBySlug(slug)) {
            throw new RuntimeException("A TopFlop entry with this slug already exists: " + slug);
        }

        // Check position availability
        if (topFlopRepository.existsByWeekOfAndEntryTypeAndPosition(dto.getWeekOf(), dto.getEntryType(), dto.getPosition())) {
            throw new RuntimeException("Position " + dto.getPosition() + " is already taken for " + dto.getEntryType() + " in week " + dto.getWeekOf());
        }

        TopFlopEntry entry = topFlopMapper.toEntity(dto);
        entry.setSlug(slug);
        entry.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");

        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageFilename = uploadProfileImage(imageFile, slug);
                entry.setProfileImage(imageFilename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload profile image: " + e.getMessage());
            }
        }

        TopFlopEntry saved = topFlopRepository.save(entry);
        return topFlopMapper.toDto(saved);
    }

    @Override
    public TopFlopResponseDto update(Long id, TopFlopRequestDto dto) {
        TopFlopEntry existing = topFlopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + id));

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getPersonName());
        if (!newSlug.equals(existing.getSlug()) && topFlopRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another TopFlop entry with this slug already exists: " + newSlug);
        }

        // Check position availability (excluding current entry)
        if (!existing.getPosition().equals(dto.getPosition()) ||
                !existing.getEntryType().equals(dto.getEntryType()) ||
                !existing.getWeekOf().equals(dto.getWeekOf())) {
            if (topFlopRepository.existsByWeekOfAndEntryTypeAndPosition(dto.getWeekOf(), dto.getEntryType(), dto.getPosition())) {
                throw new RuntimeException("Position " + dto.getPosition() + " is already taken for " + dto.getEntryType() + " in week " + dto.getWeekOf());
            }
        }

        topFlopMapper.updateEntryFromDto(dto, existing);
        existing.setSlug(newSlug);

        TopFlopEntry updated = topFlopRepository.save(existing);
        return topFlopMapper.toDto(updated);
    }

    @Override
    public TopFlopResponseDto updateWithImage(Long id, TopFlopRequestDto dto, MultipartFile imageFile) {
        TopFlopEntry existing = topFlopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + id));

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getPersonName());
        if (!newSlug.equals(existing.getSlug()) && topFlopRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another TopFlop entry with this slug already exists: " + newSlug);
        }
        topFlopMapper.updateEntryFromDto(dto, existing);
        existing.setSlug(newSlug);

        // Delete old image if new one is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if (existing.getProfileImage() != null) {
                    deleteProfileImage(existing.getProfileImage());
                }
            } catch (Exception e) {
                throw new RuntimeException("An error occurred during the deletion of the old profile image: " + e);
            }

            try {
                String newImageFilename = uploadProfileImage(imageFile, newSlug);
                existing.setProfileImage(newImageFilename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload new profile image: " + e.getMessage(), e);
            }
        }



        TopFlopEntry updated = topFlopRepository.save(existing);
        return topFlopMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        TopFlopEntry entry = topFlopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + id));

        // Delete associated image from MinIO
        if (entry.getProfileImage() != null) {
            try {
                deleteProfileImage(entry.getProfileImage());
            } catch (Exception e) {
                System.err.println("Failed to delete profile image: " + e.getMessage());
            }
        }

        topFlopRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getProfileImageInfo(Long entryId) {
        TopFlopEntry entry = topFlopRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + entryId));

        if (entry.getProfileImage() == null) {
            throw new RuntimeException("Entry has no profile image");
        }

        try {
            var fileInfo = minioService.getFileInfo(entry.getProfileImage());
            Map<String, Object> response = new HashMap<>();
            response.put("entryId", entryId);
            response.put("filename", entry.getProfileImage());
            response.put("size", fileInfo.size());
            response.put("contentType", fileInfo.contentType());
            response.put("lastModified", fileInfo.lastModified());
            response.put("etag", fileInfo.etag());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get profile image information: " + e);
        }
    }

    @Override
    public TopFlopResponseDto updateProfileImage(Long entryId, MultipartFile imageFile) {
        TopFlopEntry entry = topFlopRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("No TopFlop entry found with id: " + entryId));

        // Delete old image
        if (entry.getProfileImage() != null) {
            try {
                deleteProfileImage(entry.getProfileImage());
            } catch (Exception e) {
                throw new RuntimeException("An error occurred when deleting the old profile image: " + e);
            }
        }

        // Upload new image
        try {
            String newImageFilename = uploadProfileImage(imageFile, entry.getSlug());
            entry.setProfileImage(newImageFilename);
            TopFlopEntry updated = topFlopRepository.save(entry);
            return topFlopMapper.toDto(updated);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred when uploading the new profile image: " + e);
        }
    }

    @Override
    public void deleteProfileImage(Long entryId) {
        TopFlopEntry entry = topFlopRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("TopFlop entry not found with id: " + entryId));

        if (entry.getProfileImage() == null) {
            throw new RuntimeException("Entry has no profile image to delete");
        }

        try {
            deleteProfileImage(entry.getProfileImage());
            entry.setProfileImage(null);
            topFlopRepository.save(entry);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete the profile image: " + e);
        }
    }

    private String uploadProfileImage(MultipartFile imageFile, String slug) throws Exception {
        String originalFilename = imageFile.getOriginalFilename();
        String fileExtension = "";
        String filename = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            filename = originalFilename.substring(0, originalFilename.indexOf("."));
        }

        String uniqueFilename = "topflop_" + slug + "_" + UUID.randomUUID().toString() + fileExtension;
        minioService.uploadFile(uniqueFilename, imageFile.getInputStream(), imageFile.getContentType(), imageFile.getSize());
        return uniqueFilename;
    }

    private void deleteProfileImage(String filename) throws Exception {
        if (minioService.fileExists(filename)) {
            minioService.deleteFile(filename);
        }
    }

    private String generateSlug(String personName) {
        if (personName == null) return null;
        return personName.toLowerCase()
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-zA-Z0-9\\-]", "")
                .replaceAll("-+", "-");
    }

    private void validateCreateRequest(TopFlopRequestDto dto) {
        if (dto.getPersonName() == null || dto.getPersonName().trim().isEmpty()) {
            throw new IllegalArgumentException("Person name is required.");
        }
        if (dto.getPosition() == null || dto.getPosition() < 1 || dto.getPosition() > 10) {
            throw new IllegalArgumentException("Position must be between 1 and 10.");
        }
        if (dto.getEntryType() == null) {
            throw new IllegalArgumentException("Entry type is required.");
        }
        if (dto.getWeekOf() == null) {
            throw new IllegalArgumentException("Week date is required.");
        }
    }
}