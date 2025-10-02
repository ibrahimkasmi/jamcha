package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Data;
import lombok.Builder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
public class UserRequestDto {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @Email(message = "Email should be valid")
    private String email;

    // User basic info
    private String firstName;
    private String lastName;

    private String role;
    private String provider;
    private String providerId;

    // Author-specific fields (optional - only used when role = AUTHOR)
    private String authorName;  // Display name for the author
    private String avatar;      // Author avatar URL
}