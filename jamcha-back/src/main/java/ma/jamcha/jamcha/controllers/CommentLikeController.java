// ma.jamcha.jamcha.controllers.CommentLikeController

package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentLikeRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentLikeResponseDto;
import ma.jamcha.jamcha.services.CommentLikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "CommentLike", description = "CommentLike management APIs")
@RestController
@RequestMapping("/api/comment-likes")
@RequiredArgsConstructor
@Validated
public class CommentLikeController {

    private final CommentLikeService commentLikeService;

    @GetMapping
    public ResponseEntity<List<CommentLikeResponseDto>> getAll() {
        return ResponseEntity.ok(commentLikeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentLikeResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(commentLikeService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CommentLikeResponseDto> create(@Valid @RequestBody CommentLikeRequestDto dto) {
        CommentLikeResponseDto created = commentLikeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentLikeResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CommentLikeRequestDto dto) {
        CommentLikeResponseDto updated = commentLikeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentLikeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}