package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class CommentLikeRequestDto {
    @NotNull(message = "Comment ID is required")
    private Long commentId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private Boolean liked;
}