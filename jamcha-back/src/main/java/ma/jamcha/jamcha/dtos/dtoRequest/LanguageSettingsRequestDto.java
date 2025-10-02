package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.*;

@Data
@Builder
public class LanguageSettingsRequestDto {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private Boolean isEnabled;
    private Boolean isDefault;
    private String direction;
}