// ma.jamcha.jamcha.services.BookmarkService

package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.BookmarkResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.BookmarkRequestDto;
import java.util.List;

public interface BookmarkService {
    List<BookmarkResponseDto> getAll();
    BookmarkResponseDto getById(Long id);
    BookmarkResponseDto create(BookmarkRequestDto dto);
    BookmarkResponseDto update(Long id, BookmarkRequestDto dto);
    void delete(Long id);
}