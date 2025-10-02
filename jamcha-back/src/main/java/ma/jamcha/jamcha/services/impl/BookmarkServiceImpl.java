// ma.jamcha.jamcha.services.impl.BookmarkServiceImpl

package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.BookmarkRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.BookmarkResponseDto;
import ma.jamcha.jamcha.entities.Bookmark;
import ma.jamcha.jamcha.mappers.BookmarkMapper;
import ma.jamcha.jamcha.repositories.BookmarkRepository;
import ma.jamcha.jamcha.services.BookmarkService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final BookmarkMapper bookmarkMapper;

    @Override
    public List<BookmarkResponseDto> getAll() {
        return bookmarkRepository.findAll().stream()
                .map(bookmarkMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookmarkResponseDto getById(Long id) {
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookmark not found with id: " + id));
        return bookmarkMapper.toDto(bookmark);
    }

    @Override
    public BookmarkResponseDto create(BookmarkRequestDto dto) {
        if (bookmarkRepository.findByUserIdAndArticleId(dto.getUserId(), dto.getArticleId()).isPresent()) {
            throw new RuntimeException("Bookmark already exists for this user and article.");
        }

        Bookmark bookmark = bookmarkMapper.toEntity(dto);
        bookmark.setCreatedAt(LocalDateTime.now());

        Bookmark saved = bookmarkRepository.save(bookmark);
        return bookmarkMapper.toDto(saved);
    }

    @Override
    public BookmarkResponseDto update(Long id, BookmarkRequestDto dto) {
        Bookmark existing = bookmarkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookmark not found with id: " + id));

        if (!existing.getUser().getId().equals(dto.getUserId()) ||
                !existing.getArticle().getId().equals(dto.getArticleId())) {
            if (bookmarkRepository.findByUserIdAndArticleId(dto.getUserId(), dto.getArticleId()).isPresent()) {
                throw new RuntimeException("Bookmark already exists for this user and article.");
            }
        }

        return bookmarkMapper.toDto(existing);
    }

    @Override
    public void delete(Long id) {
        if (!bookmarkRepository.existsById(id)) {
            throw new RuntimeException("Bookmark not found with id: " + id);
        }
        bookmarkRepository.deleteById(id);
    }
}