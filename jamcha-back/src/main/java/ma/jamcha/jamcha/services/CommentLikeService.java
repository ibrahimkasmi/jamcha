// ma.jamcha.jamcha.services.CommentLikeService

package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.CommentLikeResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentLikeRequestDto;
import java.util.List;

public interface CommentLikeService {
    List<CommentLikeResponseDto> getAll();
    CommentLikeResponseDto getById(Long id);
    CommentLikeResponseDto create(CommentLikeRequestDto dto);
    CommentLikeResponseDto update(Long id, CommentLikeRequestDto dto);
    void delete(Long id);
}