package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentReportRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentReportResponseDto;
import ma.jamcha.jamcha.entities.Comment;
import ma.jamcha.jamcha.entities.CommentReport;
import ma.jamcha.jamcha.mappers.CommentReportMapper;
import ma.jamcha.jamcha.repositories.CommentReportRepository;
import ma.jamcha.jamcha.services.CommentReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentReportServiceImpl implements CommentReportService {

    private final CommentReportRepository commentReportRepository;
    private final CommentReportMapper commentReportMapper;

    @Override
    public List<CommentReportResponseDto> getAll() {
        return commentReportRepository.findAll().stream()
                .map(commentReportMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentReportResponseDto getById(Long id) {
        CommentReport report = commentReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        return commentReportMapper.toDto(report);
    }

    @Override
    public CommentReportResponseDto create(CommentReportRequestDto dto) {
        if (dto.getCommentId() == null || dto.getReason() == null || dto.getReason().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment ID and reason are required.");
        }

        CommentReport report = commentReportMapper.toEntity(dto);
        report.setReportedAt(LocalDateTime.now());
        if (report.getStatus() == null) {
            report.setStatus("pending");
        }

        CommentReport saved = commentReportRepository.save(report);
        return commentReportMapper.toDto(saved);
    }

    @Override
    public CommentReportResponseDto update(Long id, CommentReportRequestDto dto) {
        CommentReport existing = commentReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        commentReportMapper.updateCommentReportFromDto(dto, existing);
        CommentReport updated = commentReportRepository.save(existing);
        return commentReportMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!commentReportRepository.existsById(id)) {
            throw new RuntimeException("Report not found with id: " + id);
        }
        commentReportRepository.deleteById(id);
    }

    @Override
    public void reviewReport(Long id, String reviewedBy) {
        CommentReport existing = commentReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        if ("reviewed".equalsIgnoreCase(existing.getStatus())) {
            return; // Already reviewed
        }

        existing.setStatus("reviewed");
        existing.setReviewedAt(LocalDateTime.now());
        if (existing.getReviewedBy() == null && reviewedBy != null) {
            existing.setReviewedBy(reviewedBy);
        }

        commentReportRepository.save(existing);
    }
}