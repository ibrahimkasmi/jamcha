package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.LanguageSettingsResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.LanguageSettingsRequestDto;
import java.util.List;

public interface LanguageSettingsService {

    List<LanguageSettingsResponseDto> getAll();

    LanguageSettingsResponseDto getById(Long id);

    LanguageSettingsResponseDto create(LanguageSettingsRequestDto dto);

    LanguageSettingsResponseDto update(Long id, LanguageSettingsRequestDto dto);

    void delete(Long id);
}