package ma.jamcha.jamcha.services;

import java.util.Map;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import ma.jamcha.jamcha.config.KeycloakConfig;
import ma.jamcha.jamcha.config.KeycloakProperties;
import ma.jamcha.jamcha.dtos.AuthRequest;
import ma.jamcha.jamcha.dtos.AuthResponse;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.enums.UserRole;
import ma.jamcha.jamcha.mappers.MapperUtil;
import ma.jamcha.jamcha.repositories.AuthorRepository;
import ma.jamcha.jamcha.repositories.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    private static final Log log = LogFactory.getLog(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private KeycloakConfig keycloakConfig;

    @Autowired
    private KeycloakProperties keycloakProperties;

    @Autowired
    private KeycloakUserService keycloakUserService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MapperUtil mapperUtil;

    @Value("${jwt.expiration:3600}")
    private long jwtExpiration;
    public User register(UserRequestDto request) throws Exception {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Determine role
        UserRole role = UserRole.AUTHOR; // Default role
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            try {
                role = UserRole.valueOf(request.getRole().toUpperCase().trim());
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid role provided: " + request.getRole() + ", defaulting to AUTHOR");
                role = UserRole.AUTHOR;
            }
        }

        User user = null;
        String keycloakUserId = null;

        try {
            // FIRST: Try to create user in Keycloak (fail fast if password is weak)
            User tempUser;

            if (role == UserRole.AUTHOR) {
                tempUser = Author.authorBuilder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .name(request.getAuthorName() != null ?
                                request.getAuthorName() :
                                extractDisplayName(request.getFirstName(), request.getLastName(), request.getUsername()))
                        .avatar(request.getAvatar())
                        .provider(request.getProvider() != null ? request.getProvider() : "local")
                        .providerId(request.getProviderId() != null ? request.getProviderId() : request.getUsername())
                        .build();
            } else {
                tempUser = User.builder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .role(role)
                        .provider(request.getProvider() != null ? request.getProvider() : "local")
                        .providerId(request.getProviderId() != null ? request.getProviderId() : request.getUsername())
                        .build();
            }


            // Create in Keycloak FIRST - if this fails, we don't create locally
            keycloakUserId = keycloakUserService.createUserInKeycloak(tempUser, request.getPassword());
            System.out.println("User successfully created in Keycloak: " + keycloakUserId);

            // ONLY if Keycloak succeeds, create in local database
            tempUser.setKeycloakId(keycloakUserId);

            if (role == UserRole.AUTHOR) {
                user = authorRepository.save((Author) tempUser);
                System.out.println("Author created successfully in database: " + user.getUsername());
            } else {
                user = userRepository.save(tempUser);
                System.out.println("User created successfully in database: " + user.getUsername());
            }

            return user;

        } catch (Exception e) {
            System.err.println("Failed to register user: " + request.getUsername() + " - " + e.getMessage());

            // Cleanup: If Keycloak user was created but database save failed, remove from Keycloak
            if (keycloakUserId != null) {
                try {
                    keycloakUserService.deleteUserFromKeycloak(keycloakUserId);
                    System.out.println("Cleaned up Keycloak user due to database failure: " + keycloakUserId);
                } catch (Exception cleanupException) {
                    System.err.println("Failed to cleanup Keycloak user: " + cleanupException.getMessage());
                }
            }

            // If database user was created but something else failed, cleanup database
            if (user != null && user.getId() != null) {
                try {
                    if (user instanceof Author) {
                        authorRepository.deleteById(user.getId());
                    } else {
                        userRepository.deleteById(user.getId());
                    }
                    System.out.println("Cleaned up database user due to failure: " + user.getUsername());
                } catch (Exception cleanupException) {
                    System.err.println("Failed to cleanup database user: " + cleanupException.getMessage());
                }
            }

            // Provide user-friendly error messages
            if (e.getMessage().contains("password") || e.getMessage().contains("Password")) {
                throw new RuntimeException("Password does not meet security requirements. Please use a stronger password with uppercase, lowercase, numbers, and special characters.");
            } else if (e.getMessage().contains("Keycloak")) {
                throw new RuntimeException("User registration failed due to authentication service requirements: " + e.getMessage());
            } else {
                throw new RuntimeException("Failed to register user: " + e.getMessage());
            }
        }
    }

    /**
     * Extract display name from user data
     */
    private String extractDisplayName(String firstName, String lastName, String username) {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        } else if (username.contains("@")) {
            return username.substring(0, username.indexOf("@"));
        }
        return username;
    }

    /**
     * Login user
     */
    public AuthResponse login(AuthRequest request) throws Exception {
        try {
            AuthResponse keycloakResponse = loginWithKeycloak(request);
            if (keycloakResponse.isSuccess()) {
                return keycloakResponse;
            } else {
                throw new RuntimeException("Keycloak authentication failed");
            }
        } catch (Exception e) {
            throw new RuntimeException("Keycloak authentication failed: " + e.getMessage());
        }
    }

    /**
     * Login with Keycloak
     */
    private AuthResponse loginWithKeycloak(AuthRequest request) throws Exception {
        String tokenUrl = keycloakConfig.getTokenUrl();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", keycloakConfig.getClientId());
        body.add("client_secret", keycloakConfig.getClientSecret());
        body.add("username", request.getUsernameOrEmail());
        body.add("password", request.getPassword());

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                httpRequest,
                (Class<Map<String, Object>>) (Class<?>) Map.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();

            // Get user info from database
            User user = findUserByUsernameOrEmail(request.getUsernameOrEmail());

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken((String) responseBody.get("access_token"))
                    .refreshToken((String) responseBody.get("refresh_token"))
                    .expiresIn(jwtExpiration)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .firstname(user.getFirstName())
                    .lastname(user.getLastName())
                    .build();
        } else {
            throw new RuntimeException("Keycloak authentication failed");
        }
    }

    /**
     * Find user by username or email
     */
    private User findUserByUsernameOrEmail(String usernameOrEmail) throws Exception {
        Optional<User> user = userRepository.findByUsername(usernameOrEmail);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(usernameOrEmail);
        }

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return user.get();
    }

    /**
     * Get current user info
     */
    public AuthResponse getCurrentUser(String token) throws Exception {
        // Handle Keycloak token (for future implementation)
        throw new RuntimeException("Token validation not implemented for this token type");
    }

    /**
     * Refresh token
     */
    public AuthResponse refreshToken(String refreshToken) throws Exception {
        // Try Keycloak refresh first
        try {
            return refreshKeycloakToken(refreshToken);
        } catch (Exception e) {
            throw new RuntimeException("Token refresh failed: " + e.getMessage());
        }
    }

    /**
     * Refresh Keycloak token
     */
    private AuthResponse refreshKeycloakToken(String refreshToken) throws Exception {
        String tokenUrl = keycloakConfig.getTokenUrl();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", keycloakConfig.getClientId());
        body.add("client_secret", keycloakConfig.getClientSecret());
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                httpRequest,
                (Class<Map<String, Object>>) (Class<?>) Map.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();

            return AuthResponse.builder()
                    .success(true)
                    .message("Token refreshed successfully")
                    .accessToken((String) responseBody.get("access_token"))
                    .refreshToken((String) responseBody.get("refresh_token"))
                    .expiresIn(((Number) responseBody.get("expires_in")).longValue())
                    .build();
        } else {
            throw new RuntimeException("Token refresh failed");
        }
    }
}