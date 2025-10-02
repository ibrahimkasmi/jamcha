package ma.jamcha.jamcha.dtos.dtoRequest;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ArticleRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Excerpt is required")
    private String excerpt;

    private String featuredImage;
    private String videoUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private List<Long> tagIds;

    // @NotNull(message = "Author ID is required")
    private Long authorId;

    @NotNull(message = "Reading time is required")
    private Integer readingTime;

    private Boolean isBreaking;
    private Boolean isActive;
    private String language;
    private String translations;
    private LocalDateTime publishedAt;
    // adding the social media links
    private List<SocialMediaLinkRequestDto> socialMediaLinks;

}