
// TopFlopMapper - Using existing userIdToUser method
package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.TopFlopRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TopFlopResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.entities.TopFlopEntry;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.entities.Category;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class, AuthorMapper.class, CategoryMapper.class}
)
public interface TopFlopMapper {

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "author", source = "authorId", qualifiedByName = "authorIdToAuthor")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "voteCount", constant = "0")
    TopFlopEntry toEntity(TopFlopRequestDto dto);

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "author", source = "authorId", qualifiedByName = "authorIdToAuthor")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "voteCount", ignore = true)
    void updateEntryFromDto(TopFlopRequestDto dto, @MappingTarget TopFlopEntry entry);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "author", ignore = true)
    TopFlopResponseDto toDto(TopFlopEntry entry);

    @AfterMapping
    default void enrichDto(TopFlopEntry entry, @MappingTarget TopFlopResponseDto.TopFlopResponseDtoBuilder dto) {
        if (entry.getCategory() != null) {
            dto.category(categoryToDto(entry.getCategory()));
        }
        if (entry.getAuthor() != null) {
            dto.author(authorToDto(entry.getAuthor()));
        }
    }

    @Named("categoryToDto")
    CategoryResponseDto categoryToDto(Category category);

    AuthorResponseDto authorToDto(Author author);

    @ObjectFactory
    default TopFlopResponseDto.TopFlopResponseDtoBuilder topFlopResponseDtoBuilder() {
        return TopFlopResponseDto.newBuilder();
    }
}