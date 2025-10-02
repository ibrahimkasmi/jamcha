package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class BookmarkRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Article ID is required")
    private Long articleId;
}