package ma.jamcha.jamcha.dtos.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import ma.jamcha.jamcha.enums.SocialProvider;
import ma.jamcha.jamcha.validators.ValidSocialMediaLink;

@Data
@Builder
@ValidSocialMediaLink
public class SocialMediaLinkRequestDto {
    @NotBlank(message = "Social provider is required")
    private SocialProvider socialProvider;

    @NotBlank(message = "Content link is required")
    private String url;

}
