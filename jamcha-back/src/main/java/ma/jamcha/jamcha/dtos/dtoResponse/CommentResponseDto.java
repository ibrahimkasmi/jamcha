// 3. CommentResponseDto
package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder(builderMethodName = "newBuilder")
public class CommentResponseDto {
    Long id;
    Long articleId;
    String content;
    String userEmail;
    String userUsername;
    Long parentId;
    Boolean isApproved;
    Integer likesCount;
    Boolean isReported;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CommentResponseDto> replies;
}