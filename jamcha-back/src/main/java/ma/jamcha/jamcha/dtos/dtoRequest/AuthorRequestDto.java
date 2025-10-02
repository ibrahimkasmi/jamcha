package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
public class AuthorRequestDto {
    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private String avatar;
    private String provider;
    private String providerId;
}