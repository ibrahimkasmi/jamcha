package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthorResponseDto {
    Long id;
    String name;
    String email;
    String avatar;
    String provider;
    String providerId;
}