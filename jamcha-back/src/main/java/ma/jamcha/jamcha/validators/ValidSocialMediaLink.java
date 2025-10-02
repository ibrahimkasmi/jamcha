package ma.jamcha.jamcha.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SocialMediaLinkValidator.class)
@Target({ ElementType.TYPE })   // validate the whole DTO
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidSocialMediaLink {
    String message() default "Invalid social media URL for the chosen provider";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

