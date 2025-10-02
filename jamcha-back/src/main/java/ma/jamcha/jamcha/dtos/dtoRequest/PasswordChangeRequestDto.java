package ma.jamcha.jamcha.dtos.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequestDto {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;

    // Optional: Add custom validation
    public boolean isPasswordConfirmed() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}