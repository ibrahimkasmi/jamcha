// 2. CommentRequestDto
package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class CommentRequestDto {
    @NotNull(message = "Article ID is required")
    private Long articleId;

    @NotBlank(message = "Content is required")
    private String content;

    private Long parentId;
    private Boolean isApproved;
    private Integer likesCount;
    private Boolean isReported;

    // Simple user fields
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String userEmail;

    @NotBlank(message = "Username is required")
    private String userUsername;
}