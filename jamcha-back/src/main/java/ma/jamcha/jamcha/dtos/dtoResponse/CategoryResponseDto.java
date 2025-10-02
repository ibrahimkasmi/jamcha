package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CategoryResponseDto {
    Long id;
    String name;
    String slug;
    String color;
    String icon;
    String translations;
    Integer articleCount;

}