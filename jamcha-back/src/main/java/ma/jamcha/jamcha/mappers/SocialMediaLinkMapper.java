package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.SocialMediaLinkRequestDto;
import ma.jamcha.jamcha.entities.SocialMediaLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SocialMediaLinkMapper {

    SocialMediaLink toEntity(SocialMediaLinkRequestDto dto);

}