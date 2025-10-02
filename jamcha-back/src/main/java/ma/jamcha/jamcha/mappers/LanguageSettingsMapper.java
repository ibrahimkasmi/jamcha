package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.LanguageSettingsRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.LanguageSettingsResponseDto;
import ma.jamcha.jamcha.entities.LanguageSetting;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LanguageSettingsMapper {

    LanguageSettingsResponseDto toDto(LanguageSetting lang);

    LanguageSetting toEntity(LanguageSettingsRequestDto dto);

    void updateLanguageSettingsFromDto(LanguageSettingsRequestDto dto, @MappingTarget LanguageSetting lang);
}