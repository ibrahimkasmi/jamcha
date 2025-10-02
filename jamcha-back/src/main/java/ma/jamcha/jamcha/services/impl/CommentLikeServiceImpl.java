// ma.jamcha.jamcha.services.impl.CommentLikeServiceImpl

package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentLikeRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentLikeResponseDto;
import ma.jamcha.jamcha.entities.CommentLike;
import ma.jamcha.jamcha.mappers.CommentLikeMapper;
import ma.jamcha.jamcha.repositories.CommentLikeRepository;
import ma.jamcha.jamcha.services.CommentLikeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentLikeServiceImpl implements CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentLikeMapper commentLikeMapper;

    @Override
    public List<CommentLikeResponseDto> getAll() {
        return commentLikeRepository.findAll().stream()
                .map(commentLikeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentLikeResponseDto getById(Long id) {
        CommentLike like = commentLikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Like not found with id: " + id));
        return commentLikeMapper.toDto(like);
    }

    @Override
    public CommentLikeResponseDto create(CommentLikeRequestDto dto) {
        if (commentLikeRepository.findByCommentIdAndUserId(dto.getCommentId(), dto.getUserId()).isPresent()) {
            throw new RuntimeException("User has already liked this comment.");
        }

        CommentLike like = commentLikeMapper.toEntity(dto);
        like.setCreatedAt(LocalDateTime.now());

        CommentLike saved = commentLikeRepository.save(like);
        return commentLikeMapper.toDto(saved);
    }

    @Override
    public CommentLikeResponseDto update(Long id, CommentLikeRequestDto dto) {
        CommentLike existing = commentLikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Like not found with id: " + id));

        if (!existing.getComment().getId().equals(dto.getCommentId()) ||
                !existing.getUser().getId().equals(dto.getUserId())) {
            throw new RuntimeException("Cannot change comment or user of a like.");
        }

        existing.setLiked(dto.getLiked());

        CommentLike updated = commentLikeRepository.save(existing);
        return commentLikeMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!commentLikeRepository.existsById(id)) {
            throw new RuntimeException("Like not found with id: " + id);
        }
        commentLikeRepository.deleteById(id);
    }
}