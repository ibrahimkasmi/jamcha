// ma.jamcha.jamcha.services.CommentReportService

package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.CommentReportResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.CommentReportRequestDto;
import java.util.List;

public interface CommentReportService {
    List<CommentReportResponseDto> getAll();
    CommentReportResponseDto getById(Long id);
    CommentReportResponseDto create(CommentReportRequestDto dto);
    CommentReportResponseDto update(Long id, CommentReportRequestDto dto);
    void delete(Long id);
    void reviewReport(Long id, String reviewedBy);
}