// ma.jamcha.jamcha.controllers.LanguageSettingsController

package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.LanguageSettingsRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.LanguageSettingsResponseDto;
import ma.jamcha.jamcha.services.LanguageSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "LanguageSettings", description = "LanguageSettings management APIs")
@RestController
@RequestMapping("/api/language-settings")
@RequiredArgsConstructor
@Validated
public class LanguageSettingsController {

    private static final Logger log = LoggerFactory.getLogger(LanguageSettingsController.class);

    private final LanguageSettingsService languageSettingsService;

    @GetMapping
    public ResponseEntity<List<LanguageSettingsResponseDto>> getAll() {
        log.info("Fetching all language settings");
        List<LanguageSettingsResponseDto> settings = languageSettingsService.getAll();
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LanguageSettingsResponseDto> getById(@PathVariable Long id) {
        log.info("Fetching language setting with id: {}", id);
        LanguageSettingsResponseDto setting = languageSettingsService.getById(id);
        return ResponseEntity.ok(setting);
    }

    @PostMapping
    public ResponseEntity<LanguageSettingsResponseDto> create(@Valid @RequestBody LanguageSettingsRequestDto dto) {
        log.info("Creating language setting with code: {}", dto.getCode());
        LanguageSettingsResponseDto created = languageSettingsService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LanguageSettingsResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody LanguageSettingsRequestDto dto) {
        log.info("Updating language setting with id: {}", id);
        LanguageSettingsResponseDto updated = languageSettingsService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting language setting with id: {}", id);
        languageSettingsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}