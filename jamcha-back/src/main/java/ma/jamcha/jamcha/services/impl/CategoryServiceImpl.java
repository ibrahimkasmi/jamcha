package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CategoryRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.entities.Category;
import ma.jamcha.jamcha.mappers.CategoryMapper;
import ma.jamcha.jamcha.repositories.CategoryRepository;
import ma.jamcha.jamcha.services.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponseDto> getAll() {
        // Use the new method that gets count efficiently
        List<Object[]> results = categoryRepository.findCategoriesWithArticleCount();
        return results.stream()
                .map(this::mapToCategoryResponseDto)
                .collect(Collectors.toList());
    }

    // Helper method to map Object[] to CategoryResponseDto
    private CategoryResponseDto mapToCategoryResponseDto(Object[] result) {
        return CategoryResponseDto.builder()
                .id((Long) result[0])
                .name((String) result[1])
                .slug((String) result[2])
                .color((String) result[3])
                .icon((String) result[4])
                .translations((String) result[5])
                .articleCount(((Number) result[6]).intValue())
                .build();
    }

    @Override
    public CategoryResponseDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return categoryMapper.toDto(category);
    }

    @Override
    public CategoryResponseDto create(CategoryRequestDto dto) {
        // Validate input
        if (dto.getName() == null || dto.getSlug() == null) {
            throw new IllegalArgumentException("Name and slug are required.");
        }

        // Ensure uniqueness
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("A category with this name already exists.");
        }
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("A category with this slug already exists.");
        }

        Category category = categoryMapper.toEntity(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    public CategoryResponseDto update(Long id, CategoryRequestDto dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check for conflicts when updating name/slug
        if (!existing.getName().equals(dto.getName()) &&
                categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Another category with this name already exists.");
        }
        if (!existing.getSlug().equals(dto.getSlug()) &&
                categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("Another category with this slug already exists.");
        }

        // Use mapper to update entity
        categoryMapper.updateCategoryFromDto(dto, existing);

        Category updated = categoryRepository.save(existing);
        return categoryMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}