package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.NewsletterRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.NewsletterResponseDto;
import ma.jamcha.jamcha.entities.Newsletter;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NewsletterMapper {
    NewsletterResponseDto toDto(Newsletter newsletter);
    Newsletter toEntity(NewsletterRequestDto dto);
    void updateNewsletterFromDto(NewsletterRequestDto dto, @MappingTarget Newsletter newsletter);
}