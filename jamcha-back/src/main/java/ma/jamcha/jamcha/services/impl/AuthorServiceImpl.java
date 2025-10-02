package ma.jamcha.jamcha.services.impl;
import lombok.RequiredArgsConstructor;

import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorStatsDto;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.repositories.AuthorRepository;
import ma.jamcha.jamcha.services.AuthorService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
private final ma.jamcha.jamcha.mappers.AuthorMapper authorMapper;
    public List<AuthorStatsDto> getPopularAuthors(int limit) {
        return authorRepository.findPopularAuthors(PageRequest.of(0, limit))
                .stream()
                .map(projection -> AuthorStatsDto.builder()
                        .id(projection.getId())
                        .name(projection.getName())
                        .avatar(projection.getAvatar())
                        .articleCount(projection.getArticleCount())
                        .build())
                .toList();
    }

    @Override
    public List<AuthorResponseDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(authorMapper::toDto)
                .collect(Collectors.toList());
    }
}
