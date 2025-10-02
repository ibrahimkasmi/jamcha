package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentResponseDto;
import ma.jamcha.jamcha.entities.Comment;
import ma.jamcha.jamcha.mappers.CommentMapper;
import ma.jamcha.jamcha.repositories.CommentRepository;
import ma.jamcha.jamcha.services.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getAll() {
        return commentRepository.findAll().stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponseDto getById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        return commentMapper.toDto(comment);
    }

    @Override
    public CommentResponseDto create(CommentRequestDto dto) {
        if (dto.getArticleId() == null || dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Article ID and content are required.");
        }

        if (dto.getUserEmail() == null || dto.getUserEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email is required.");
        }

        if (dto.getUserUsername() == null || dto.getUserUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required.");
        }

        Comment comment = commentMapper.toEntity(dto);
        comment.setUserEmail(dto.getUserEmail().toLowerCase().trim());
        comment.setUserUsername(dto.getUserUsername().trim());

        // Set defaults
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        comment.setIsApproved(true);
        comment.setLikesCount(0);
        comment.setIsReported(false);

        Comment saved = commentRepository.save(comment);
        return commentMapper.toDto(saved);
    }

    @Override
    public CommentResponseDto update(Long id, CommentRequestDto dto) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        // Simple validation - check email matches (for basic ownership verification)
        if (!dto.getUserEmail().equalsIgnoreCase(existing.getUserEmail())) {
            throw new RuntimeException("Cannot update comment - email mismatch");
        }

        // Update content and timestamp
        existing.setContent(dto.getContent());
        existing.setUpdatedAt(LocalDateTime.now());

        Comment updated = commentRepository.save(existing);
        return commentMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getByArticleId(Long articleId) {
        List<Comment> comments = commentRepository.findByArticleId(articleId);
        return comments.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponseDto likeComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        // Increment likes count
        int currentLikes = comment.getLikesCount() != null ? comment.getLikesCount() : 0;
        comment.setLikesCount(currentLikes + 1);
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updated = commentRepository.save(comment);
        return commentMapper.toDto(updated);
    }

    @Override
    public CommentResponseDto reportComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        // Mark as reported
        comment.setIsReported(true);
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updated = commentRepository.save(comment);
        return commentMapper.toDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCommentCountByArticleId(Long articleId) {
        return commentRepository.countByArticleId(articleId);
    }
}