// PodcastRequestDto
package ma.jamcha.jamcha.dtos.dtoRequest;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PodcastRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Video URL is required")
    @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.be)/.+$",
            message = "Must be a valid YouTube URL")
    private String videoUrl;

    private String thumbnailUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private List<Long> tagIds;
    @NotNull(message = "Author ID is required")
    private Long authorId;  // Instead of AuthorRequestDto author
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    private Boolean isFeatured;
    private String language;
    private String translations;
    private LocalDateTime publishedAt;
}