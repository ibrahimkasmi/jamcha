// ma.jamcha.jamcha.controllers.CommentReportController

package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentReportRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentReportResponseDto;
import ma.jamcha.jamcha.services.CommentReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "CommentReport", description = "CommentReport management APIs")
@RestController
@RequestMapping("/api/comment-reports")
@RequiredArgsConstructor
@Validated
public class CommentReportController {

    private final CommentReportService commentReportService;

    @GetMapping
    public ResponseEntity<List<CommentReportResponseDto>> getAll() {
        return ResponseEntity.ok(commentReportService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentReportResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(commentReportService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CommentReportResponseDto> create(@Valid @RequestBody CommentReportRequestDto dto) {
        CommentReportResponseDto created = commentReportService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentReportResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CommentReportRequestDto dto) {
        CommentReportResponseDto updated = commentReportService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentReportService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Special endpoint: Mark report as reviewed
    @PutMapping("/{id}/review")
    public ResponseEntity<Void> reviewReport(
            @PathVariable Long id,
            @RequestParam String reviewedBy) {
        commentReportService.reviewReport(id, reviewedBy);
        return ResponseEntity.ok().build();
    }
}