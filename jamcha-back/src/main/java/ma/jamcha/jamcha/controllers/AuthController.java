package ma.jamcha.jamcha.controllers;

import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.AuthRequest;
import ma.jamcha.jamcha.dtos.AuthResponse;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;
import ma.jamcha.jamcha.enums.UserRole;
import ma.jamcha.jamcha.services.AuthService;
import ma.jamcha.jamcha.utils.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "Authentication management APIs")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody UserRequestDto request
    ) throws Exception {
        var user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                AuthResponse.builder()
                        .success(true)
                        .message("User registered successfully")
                        .userId(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .firstname(user.getFirstName())
                        .lastname(user.getLastName())
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request
    ) throws Exception {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(
            @RequestHeader(value = "Authorization", required = false) String token
    ) {
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .success(true)
                        .message("Logged out successfully")
                        .build()
        );
    }

    @PostMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .success(true)
                        .message("Token is valid")
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserResponseDto userDto = JwtUtils.extractUser(jwt);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(
                Map.of(
                        "service",
                        "authentication",
                        "status",
                        "UP",
                        "timestamp",
                        System.currentTimeMillis(),
                        "keycloak_configured",
                        true
                )
        );
    }

    @GetMapping("/token-info")
    public ResponseEntity<?> getTokenInfo(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                Map.of(
                        "success",
                        true,
                        "message",
                        "Token claims retrieved",
                        "claims",
                        jwt.getClaims(),
                        "headers",
                        jwt.getHeaders()
                )
        );
    }
}