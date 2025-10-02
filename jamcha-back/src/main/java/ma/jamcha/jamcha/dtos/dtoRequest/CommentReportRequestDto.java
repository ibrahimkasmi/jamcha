package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.*;

@Data
@Builder
public class CommentReportRequestDto {
    @NotNull(message = "Comment ID is required")
    private Long commentId;

    @NotBlank(message = "Reason is required")
    @Size(max = 100, message = "Reason cannot exceed 100 characters")
    private String reason;

    private String details;
}