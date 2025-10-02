// PodcastResponseDto
package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder(builderMethodName = "newBuilder")
public class PodcastResponseDto {
    Long id;
    String title;
    String slug;
    String description;
    String videoUrl;
    String thumbnailUrl;
    CategoryResponseDto category;
    List<TagResponseDto> tags;
    List<PodcastCommentResponseDto> comments;
    AuthorResponseDto author;
    Integer duration;
    Long viewCount;
    LocalDateTime publishedAt;
    Boolean isFeatured;
    String language;
    String translations;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}