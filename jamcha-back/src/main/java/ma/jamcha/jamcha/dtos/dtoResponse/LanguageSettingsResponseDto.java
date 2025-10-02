package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

@Value
@Builder
public class LanguageSettingsResponseDto {
    Long id;
    String code;
    String name;
    Boolean isEnabled;
    Boolean isDefault;
    String direction;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}