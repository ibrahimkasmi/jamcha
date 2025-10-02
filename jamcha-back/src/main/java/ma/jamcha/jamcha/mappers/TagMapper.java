package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.TagRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TagResponseDto;
import ma.jamcha.jamcha.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagResponseDto toDto(Tag tag);
    Tag toEntity(TagRequestDto dto);
    void updateTagFromDto(TagRequestDto dto, @MappingTarget Tag tag);
}