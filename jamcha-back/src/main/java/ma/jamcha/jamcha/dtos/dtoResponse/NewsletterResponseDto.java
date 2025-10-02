package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class NewsletterResponseDto {
    Long id;
    String email;
    Boolean isActive;
    LocalDateTime subscribedAt;
}
