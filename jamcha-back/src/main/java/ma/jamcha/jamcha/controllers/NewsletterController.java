package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.NewsletterRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.NewsletterResponseDto;
import ma.jamcha.jamcha.services.NewsletterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Newsletter", description = "Newsletter management APIs")
@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        try {
            NewsletterRequestDto dto = NewsletterRequestDto.builder()
                    .email(email)
                    .isActive(true)
                    .build();

            newsletterService.create(dto);
            return ResponseEntity.ok(Map.of("message", "Successfully subscribed to newsletter"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<NewsletterResponseDto>> getAll() {
        return ResponseEntity.ok(newsletterService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsletterResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(newsletterService.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsletterResponseDto> create(@Valid @RequestBody NewsletterRequestDto dto) {
        NewsletterResponseDto created = newsletterService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsletterResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody NewsletterRequestDto dto) {
        NewsletterResponseDto updated = newsletterService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsletterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}