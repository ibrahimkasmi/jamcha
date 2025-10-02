package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;

import java.security.Timestamp;
import java.time.LocalDateTime;

@Value
@Builder
public class UserResponseDto {
    Long id;
    String username;
    String email;
    String firstName;
    String lastName;
    String role;
    String provider;
    String providerId;

    // Author-specific fields (will be null for non-author users)
    String authorName;
    String avatar;
    LocalDateTime createdAt;

    // Helper method to check if this user is an author
    public boolean isAuthor() {
        return "AUTHOR".equals(role);
    }
}