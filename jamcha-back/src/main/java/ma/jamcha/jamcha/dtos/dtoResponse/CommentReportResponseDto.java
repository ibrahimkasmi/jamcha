package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

@Value
@Builder(builderMethodName = "newBuilder")
public class CommentReportResponseDto {
    Long id;
    CommentResponseDto comment;
    String reason;
    String details;
    LocalDateTime reportedAt;
    String status;
    String reviewedBy;
    LocalDateTime reviewedAt;
}