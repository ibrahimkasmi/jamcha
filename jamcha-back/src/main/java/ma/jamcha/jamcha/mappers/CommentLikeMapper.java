package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.CommentLikeRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentLikeResponseDto;
import ma.jamcha.jamcha.entities.CommentLike;
import org.mapstruct.*;
import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class}
)
public interface CommentLikeMapper {

    @Mapping(target = "comment", source = "commentId", qualifiedByName = "commentIdToComment")
    @Mapping(target = "user", source = "userId", qualifiedByName = "userIdToUser")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CommentLike toEntity(CommentLikeRequestDto dto);

    CommentLikeResponseDto toDto(CommentLike like);
}