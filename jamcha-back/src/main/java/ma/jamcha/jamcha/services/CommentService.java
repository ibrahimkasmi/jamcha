// 6. CommentService Interface
package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoRequest.CommentRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentResponseDto;

import java.util.List;

public interface CommentService {
    List<CommentResponseDto> getAll();
    CommentResponseDto getById(Long id);
    CommentResponseDto create(CommentRequestDto dto);
    CommentResponseDto update(Long id, CommentRequestDto dto);
    void delete(Long id);
    List<CommentResponseDto> getByArticleId(Long articleId);
    CommentResponseDto likeComment(Long id);
    CommentResponseDto reportComment(Long id);
    Long getCommentCountByArticleId(Long articleId);
}
