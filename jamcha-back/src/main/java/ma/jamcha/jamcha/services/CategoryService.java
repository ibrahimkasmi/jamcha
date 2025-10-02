package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.CategoryRequestDto;
import ma.jamcha.jamcha.repositories.CategoryRepository;

import java.util.List;

public interface CategoryService {


    List<CategoryResponseDto> getAll();

    CategoryResponseDto getById(Long id);

    CategoryResponseDto create(CategoryRequestDto dto);

    CategoryResponseDto update(Long id, CategoryRequestDto dto);

    void delete(Long id);
}