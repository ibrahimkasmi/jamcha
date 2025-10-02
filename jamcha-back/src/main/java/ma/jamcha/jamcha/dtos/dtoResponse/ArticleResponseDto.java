package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder(builderMethodName = "newBuilder")
public class ArticleResponseDto {
    Long id;
    String title;
    String slug;
    String content;
    String excerpt;
    String videoUrl;
    String featuredImage;
    CategoryResponseDto category;
    List<TagResponseDto> tags;
    List<CommentResponseDto> comments;
    AuthorResponseDto author;
    Integer readingTime;
    LocalDateTime publishedAt;
    Boolean isBreaking;
    Boolean isActive;
    String language;
    String translations;
    List<SocialMediaLinkResponseDto> socialMediaLinkResponseDtos;

}