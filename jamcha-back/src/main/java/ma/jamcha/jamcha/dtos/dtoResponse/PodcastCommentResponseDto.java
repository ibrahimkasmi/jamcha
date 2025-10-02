// PodcastCommentResponseDto
package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

@Value
@Builder(builderMethodName = "newBuilder")
public class PodcastCommentResponseDto {
    Long id;
    String content;
    String authorName;
    String authorEmail;
    Boolean approved;
    LocalDateTime createdAt;
}