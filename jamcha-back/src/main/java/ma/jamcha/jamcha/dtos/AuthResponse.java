package ma.jamcha.jamcha.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.jamcha.jamcha.enums.UserRole;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long expiresIn; // in seconds

    // User information
    private Long userId;
    private String username;
    private String email;
    private UserRole role;
    private String firstname;
    private String lastname;

}
