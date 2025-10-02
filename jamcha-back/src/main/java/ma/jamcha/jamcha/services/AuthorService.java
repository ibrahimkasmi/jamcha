package ma.jamcha.jamcha.services;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorStatsDto;
import ma.jamcha.jamcha.entities.Author;

import java.util.List;

public interface AuthorService {
    List<AuthorStatsDto> getPopularAuthors(int limit);
    List<AuthorResponseDto> getAllAuthors();
}
