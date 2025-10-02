package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.TagResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.TagRequestDto;
import java.util.List;

public interface TagService {
    List<TagResponseDto> getAll();
    TagResponseDto getById(Long id);
    TagResponseDto create(TagRequestDto dto);
    TagResponseDto update(Long id, TagRequestDto dto);
    void delete(Long id);
}