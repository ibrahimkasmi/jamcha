package ma.jamcha.jamcha.controllers;
import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.PodcastRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.PodcastResponseDto;
import ma.jamcha.jamcha.services.PodcastService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Podcast", description = "Podcast management APIs")
@RestController
@RequestMapping("/api/podcasts")
@RequiredArgsConstructor
@Validated
public class PodcastController {

    private final PodcastService podcastService;

    @GetMapping
    public ResponseEntity<List<PodcastResponseDto>> getAll(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category) {
        List<PodcastResponseDto> podcasts = podcastService.getByLanguageAndCategory(language, limit, category);
        return ResponseEntity.ok(podcasts);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<PodcastResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(podcastService.getById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PodcastResponseDto> createPodcastWithThumbnail(
            @RequestPart("podcast") @Valid PodcastRequestDto dto,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnailFile) {
        PodcastResponseDto created = podcastService.createWithThumbnail(dto, thumbnailFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PodcastResponseDto> updatePodcastWithThumbnail(
            @PathVariable Long id,
            @RequestPart("podcast") @Valid PodcastRequestDto dto,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnailFile) {
        return ResponseEntity.ok(podcastService.updateWithThumbnail(id, dto, thumbnailFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        podcastService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/thumbnail")
    public ResponseEntity<Void> deletePodcastThumbnail(@PathVariable Long id) {
        podcastService.deletePodcastThumbnail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/thumbnail/info")
    public ResponseEntity<Map<String, Object>> getPodcastThumbnailInfo(@PathVariable Long id) {
        return ResponseEntity.ok(podcastService.getPodcastThumbnailInfo(id));
    }

    @PutMapping(value = "/{id}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PodcastResponseDto> updatePodcastThumbnail(
            @PathVariable Long id,
            @RequestPart("thumbnail") MultipartFile thumbnailFile) {
        return ResponseEntity.ok(podcastService.updatePodcastThumbnail(id, thumbnailFile));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PodcastResponseDto> getPodcastBySlug(@PathVariable String slug) {
        PodcastResponseDto podcast = podcastService.findBySlug(slug);
        return ResponseEntity.ok(podcast);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PodcastResponseDto>> getFeaturedPodcasts(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "5") int limit) {
        List<PodcastResponseDto> podcasts = podcastService.getFeaturedByLanguage(language, limit);
        return ResponseEntity.ok(podcasts);
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<List<PodcastResponseDto>> getMostViewedPodcasts(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "10") int limit) {
        List<PodcastResponseDto> podcasts = podcastService.getMostViewed(language, limit);
        return ResponseEntity.ok(podcasts);
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        podcastService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PodcastResponseDto>> searchPodcasts(
            @RequestParam String query,
            @RequestParam(defaultValue = "ar") String language) {
        List<PodcastResponseDto> podcasts = podcastService.searchByTitleOrDescription(query, language);
        return ResponseEntity.ok(podcasts);
    }
}