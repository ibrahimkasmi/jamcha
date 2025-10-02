// 5. CommentMapper
package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.CommentRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentResponseDto;
import ma.jamcha.jamcha.entities.Article;
import ma.jamcha.jamcha.entities.Comment;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CommentMapper {

    @Mapping(target = "article", source = "articleId", qualifiedByName = "articleFromId")
    @Mapping(target = "parent", source = "parentId", qualifiedByName = "commentFromId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment toEntity(CommentRequestDto dto);

    @Mapping(target = "article", source = "articleId", qualifiedByName = "articleFromId")
    @Mapping(target = "parent", source = "parentId", qualifiedByName = "commentFromId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCommentFromDto(CommentRequestDto dto, @MappingTarget Comment comment);

    @Mapping(target = "articleId", source = "article.id")
    @Mapping(target = "parentId", source = "parent.id")
    @Mapping(target = "replies", ignore = true)
    CommentResponseDto toDto(Comment comment);

    @ObjectFactory
    default CommentResponseDto.CommentResponseDtoBuilder commentResponseDtoBuilder() {
        return CommentResponseDto.newBuilder();
    }

    @Named("articleFromId")
    default Article articleFromId(Long articleId) {
        if (articleId == null) return null;
        Article article = new Article();
        article.setId(articleId);
        return article;
    }

    @Named("commentFromId")
    default Comment commentFromId(Long commentId) {
        if (commentId == null) return null;
        Comment comment = new Comment();
        comment.setId(commentId);
        return comment;
    }
}