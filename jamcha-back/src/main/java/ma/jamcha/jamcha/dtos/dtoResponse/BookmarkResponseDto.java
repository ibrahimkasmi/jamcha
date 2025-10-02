package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

@Value
@Builder(builderMethodName = "newBuilder")
public class BookmarkResponseDto {
    Long id;
    UserResponseDto user;
    ArticleResponseDto article;
    LocalDateTime createdAt;
}