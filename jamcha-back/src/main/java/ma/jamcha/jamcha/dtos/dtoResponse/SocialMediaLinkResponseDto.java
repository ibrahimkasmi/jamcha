package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Data;
import ma.jamcha.jamcha.enums.SocialProvider;

@Data
@Builder
public class SocialMediaLinkResponseDto {
    private Long id;
    private SocialProvider socialProvider;
    private String url;
}