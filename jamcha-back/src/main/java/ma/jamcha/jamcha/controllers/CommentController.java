// 8. CommentController
package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentResponseDto;
import ma.jamcha.jamcha.services.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Comment", description = "Comment management APIs")
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getAll() {
        return ResponseEntity.ok(commentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDto> getById(@PathVariable Long id) {
        try {
            CommentResponseDto comment = commentService.getById(id);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CommentRequestDto dto) {
        try {
            CommentResponseDto created = commentService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create comment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody CommentRequestDto dto) {
        try {
            CommentResponseDto updated = commentService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            commentService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentResponseDto>> getByArticleId(@PathVariable Long articleId) {
        List<CommentResponseDto> comments = commentService.getByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeComment(@PathVariable Long id) {
        try {
            CommentResponseDto likedComment = commentService.likeComment(id);
            return ResponseEntity.ok(likedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportComment(@PathVariable Long id) {
        try {
            CommentResponseDto reportedComment = commentService.reportComment(id);
            return ResponseEntity.ok(reportedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/article/{articleId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable Long articleId) {
        Long count = commentService.getCommentCountByArticleId(articleId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}