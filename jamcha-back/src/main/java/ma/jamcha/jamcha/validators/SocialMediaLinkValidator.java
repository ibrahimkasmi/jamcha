package ma.jamcha.jamcha.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ma.jamcha.jamcha.dtos.dtoRequest.SocialMediaLinkRequestDto;
import ma.jamcha.jamcha.enums.SocialProvider;

public class SocialMediaLinkValidator implements ConstraintValidator<ValidSocialMediaLink, SocialMediaLinkRequestDto> {

    @Override
    public boolean isValid(SocialMediaLinkRequestDto dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getUrl() == null || dto.getSocialProvider() == null) {
            return true; // handled by @NotBlank already
        }

        String url = dto.getUrl().toLowerCase();
        SocialProvider provider = dto.getSocialProvider();

        switch (provider) {
            case FACEBOOK:
                return url.startsWith("https://facebook.com") || url.startsWith("https://www.facebook.com");
            case INSTAGRAM:
                return url.startsWith("https://instagram.com") || url.startsWith("https://www.instagram.com");
            case LINKEDIN:
                return url.startsWith("https://linkedin.com") || url.startsWith("https://www.linkedin.com");
            case X:
                return url.startsWith("https://x.com") || url.startsWith("https://twitter.com");
            case YOUTUBE:
                return url.startsWith("https://youtube.com") || url.startsWith("https://www.youtube.com");
            default:
                return false;
        }
    }
}

