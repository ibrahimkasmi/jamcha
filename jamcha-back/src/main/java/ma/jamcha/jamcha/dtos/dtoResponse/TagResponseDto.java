package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TagResponseDto {
    Long id;
    String name;
    String color;
}