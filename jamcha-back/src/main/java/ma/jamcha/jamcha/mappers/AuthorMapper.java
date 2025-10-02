package ma.jamcha.jamcha.mappers;


import ma.jamcha.jamcha.dtos.dtoRequest.AuthorRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.entities.Author;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    AuthorResponseDto toDto(Author author);

    Author toEntity(AuthorRequestDto dto);

    void updateAuthorFromDto(AuthorRequestDto dto, @MappingTarget Author author);
}