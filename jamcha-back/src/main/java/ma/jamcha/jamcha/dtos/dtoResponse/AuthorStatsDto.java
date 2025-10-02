// 2. AuthorStatsDto.java
package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthorStatsDto {
    Long id;
    String name;
    String avatar;
    Long articleCount;
}