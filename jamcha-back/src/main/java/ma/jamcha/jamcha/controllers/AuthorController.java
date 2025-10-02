// ma.jamcha.jamcha.controllers.AuthorController

package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorStatsDto;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.services.AuthorService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Author", description = "Author management APIs")
@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
@Validated
public class AuthorController {

    private final AuthorService authorService;
    @GetMapping()
    public ResponseEntity<List<AuthorResponseDto>> getAllAuthors() {
        List<AuthorResponseDto> authors = authorService.getAllAuthors();
        return ResponseEntity.ok(authors);
    }
    @GetMapping("/popular")
    public ResponseEntity<List<AuthorStatsDto>> getPopularAuthors(
            @RequestParam(defaultValue = "20") int limit) {
        List<AuthorStatsDto> authors = authorService.getPopularAuthors(limit);
        return ResponseEntity.ok(authors);
    }
}