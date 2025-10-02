package ma.jamcha.jamcha.dtos.dtoRequest;

import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
@Builder
public class UserUpdateRequestDto {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters when provided")
    private String password;

    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    private String role;

    private String provider;

    private String providerId;
    // Author-specific fields (optional - only used when role = AUTHOR)
    private String authorName;  // Display name for the author
    private String avatar;      // Author avatar URL
}
