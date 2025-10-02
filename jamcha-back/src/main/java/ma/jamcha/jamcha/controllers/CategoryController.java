// ma.jamcha.jamcha.controllers.CategoryController

package ma.jamcha.jamcha.controllers;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.ErrorResponse;
import ma.jamcha.jamcha.dtos.dtoRequest.CategoryRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.services.CategoryService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "Category", description = "Category management APIs")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Validated
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDto> create(@Valid @RequestBody CategoryRequestDto dto) {
        CategoryResponseDto created = categoryService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDto dto) {
        CategoryResponseDto updated = categoryService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            // Check if it's a foreign key constraint violation
            if (e.getCause() instanceof ConstraintViolationException ||
                    e.getMessage().contains("foreign key constraint")) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Cannot delete category. It contains articles that must be moved or deleted first."));
            }
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("An error occurred while deleting the category.", "INTERNAL_ERROR"));
        }
    }
}