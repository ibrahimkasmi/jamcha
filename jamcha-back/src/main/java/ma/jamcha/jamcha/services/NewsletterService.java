package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoRequest.NewsletterRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.NewsletterResponseDto;

import java.util.List;

public interface NewsletterService {
    List<NewsletterResponseDto> getAll();
    NewsletterResponseDto getById(Long id);
    NewsletterResponseDto create(NewsletterRequestDto dto);
    NewsletterResponseDto update(Long id, NewsletterRequestDto dto);
    void delete(Long id);
}
