package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.BookmarkRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.BookmarkResponseDto;
import ma.jamcha.jamcha.entities.Bookmark;
import org.mapstruct.*;
import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class}
)
public interface BookmarkMapper {

    @Mapping(target = "user", source = "userId", qualifiedByName = "userIdToUser")
    @Mapping(target = "article", source = "articleId", qualifiedByName = "articleIdToArticle")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Bookmark toEntity(BookmarkRequestDto dto);

    BookmarkResponseDto toDto(Bookmark bookmark);
}