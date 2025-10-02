
// TopFlopController
package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.TopFlopRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TopFlopResponseDto;
import ma.jamcha.jamcha.services.TopFlopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "TopFlop", description = "TopFlop management APIs")
@RestController
@RequestMapping("/api/topflop")
@RequiredArgsConstructor
@Validated
public class TopFlopController {

    private final TopFlopService topFlopService;

    @GetMapping("/current-week")
    public ResponseEntity<List<TopFlopResponseDto>> getCurrentWeekEntries(
            @RequestParam(defaultValue = "ar") String language) {
        List<TopFlopResponseDto> entries = topFlopService.getCurrentWeekEntries(language);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/week/{date}")
    public ResponseEntity<List<TopFlopResponseDto>> getEntriesByWeek(
            @PathVariable LocalDate date,
            @RequestParam(defaultValue = "ar") String language) {
        List<TopFlopResponseDto> entries = topFlopService.getEntriesByWeek(date, language);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<TopFlopResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(topFlopService.getById(id));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<TopFlopResponseDto> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(topFlopService.findBySlug(slug));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TopFlopResponseDto> createWithImage(
            @RequestPart("entry") @Valid TopFlopRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        TopFlopResponseDto created = topFlopService.createWithImage(dto, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TopFlopResponseDto> updateWithImage(
            @PathVariable Long id,
            @RequestPart("entry") @Valid TopFlopRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(topFlopService.updateWithImage(id, dto, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        topFlopService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image/info")
    public ResponseEntity<Map<String, Object>> getProfileImageInfo(@PathVariable Long id) {
        return ResponseEntity.ok(topFlopService.getProfileImageInfo(id));
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TopFlopResponseDto> updateProfileImage(
            @PathVariable Long id,
            @RequestPart("image") MultipartFile imageFile) {
        return ResponseEntity.ok(topFlopService.updateProfileImage(id, imageFile));
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteProfileImage(@PathVariable Long id) {
        topFlopService.deleteProfileImage(id);
        return ResponseEntity.noContent().build();
    }
}