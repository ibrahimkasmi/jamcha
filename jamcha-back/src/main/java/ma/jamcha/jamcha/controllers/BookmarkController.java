// ma.jamcha.jamcha.controllers.BookmarkController

package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.BookmarkRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.BookmarkResponseDto;
import ma.jamcha.jamcha.services.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "Bookmark", description = "Bookmark management APIs")
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@Validated
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<List<BookmarkResponseDto>> getAll() {
        return ResponseEntity.ok(bookmarkService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookmarkResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookmarkService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookmarkResponseDto> create(@Valid @RequestBody BookmarkRequestDto dto) {
        BookmarkResponseDto created = bookmarkService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookmarkResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody BookmarkRequestDto dto) {
        BookmarkResponseDto updated = bookmarkService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookmarkService.delete(id);
        return ResponseEntity.noContent().build();
    }
}