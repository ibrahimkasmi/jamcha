package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

@Value
@Builder(builderMethodName = "newBuilder")
public class CommentLikeResponseDto {
    Long id;
    CommentResponseDto comment;
    UserResponseDto user;
    LocalDateTime createdAt;
    Boolean liked;
}