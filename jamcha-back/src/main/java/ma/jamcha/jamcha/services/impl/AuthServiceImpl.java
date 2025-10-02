package ma.jamcha.jamcha.services.impl;

import java.util.Map;
import java.util.Optional;
import ma.jamcha.jamcha.config.KeycloakConfig;
import ma.jamcha.jamcha.config.KeycloakProperties;
import ma.jamcha.jamcha.controllers.ArticleController;
import ma.jamcha.jamcha.dtos.AuthRequest;
import ma.jamcha.jamcha.dtos.AuthResponse;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.enums.UserRole;
import ma.jamcha.jamcha.mappers.MapperUtil;
import ma.jamcha.jamcha.repositories.AuthorRepository;
import ma.jamcha.jamcha.repositories.UserRepository;
import ma.jamcha.jamcha.services.AuthService;
import ma.jamcha.jamcha.services.KeycloakUserService;
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
public class AuthServiceImpl {

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

    /**
     * Register a new user with proper inheritance support
     */
    @Value("${jwt.expiration:3600}")
    private Long jwtExpiration;
    public User register(UserRequestDto request) throws Exception {
        log.info("Registering new user: {} with role: {}");

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = null;
        String keycloakUserId = null;

        try {
            // Determine role
            UserRole role = request.getRole() != null ?
                    UserRole.valueOf(request.getRole().toUpperCase()) : UserRole.AUTHOR;

            // Create appropriate entity based on role using inheritance
            if (role == UserRole.AUTHOR) {
                // Create Author entity (which extends User)
                Author author = Author.authorBuilder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .name(request.getAuthorName() != null ?
                                request.getAuthorName() :
                                extractDisplayName(request.getFirstName(), request.getLastName(), request.getUsername()))
                        .avatar(request.getAvatar())
                        .provider("local")
                        .providerId(request.getUsername())
                        .build();

                user = authorRepository.save(author);
                log.info("Author created successfully: {}");

            } else {
                // Create regular User entity (for ADMIN role)
                user = User.builder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .role(role)
                        .provider("local")
                        .providerId(request.getUsername())
                        .build();

                user = userRepository.save(user);
                log.info("User created successfully: {}");
            }

            // Try to create user in Keycloak (if available)
            try {
                keycloakUserId = keycloakUserService.createUserInKeycloak(user, request.getPassword());
                user.setKeycloakId(keycloakUserId);

                // Save the updated user with Keycloak ID
                if (user instanceof Author) {
                    user = authorRepository.save((Author) user);
                } else {
                    user = userRepository.save(user);
                }

                log.info("User successfully synced with Keycloak: {}");
            } catch (Exception e) {
                log.warn("Could not create user in Keycloak (continuing without Keycloak): {}");
            }

            return user;

        } catch (Exception e) {
            log.error("Failed to register user: {}");

            // Cleanup: If we created the user locally but failed elsewhere, remove it
            if (user != null && user.getId() != null) {
                try {
                    if (user instanceof Author) {
                        authorRepository.deleteById(user.getId());
                    } else {
                        userRepository.deleteById(user.getId());
                    }
                    log.info("Cleaned up failed user registration: {}");
                } catch (Exception cleanupException) {
                    log.error("Failed to cleanup user during registration failure", cleanupException);
                }
            }

            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);
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
        log.info("Attempting login for user: {}");

        try {
            AuthResponse keycloakResponse = loginWithKeycloak(request);
            log.info("Keycloak authentication successful for user: {}");

            if (keycloakResponse.isSuccess()) {
                return keycloakResponse;
            } else {
                throw new RuntimeException("Keycloak authentication failed");
            }
        } catch (Exception e) {
            log.error("Authentication failed for user: {}");
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    /**
     * Login with Keycloak
     */
    private AuthResponse loginWithKeycloak(AuthRequest request) throws Exception {
        String tokenUrl = keycloakConfig.getTokenUrl();
        log.info("Using Keycloak token URL: {}");

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
            throw new RuntimeException("Keycloak authentication failed with status: " + response.getStatusCode());
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
            throw new RuntimeException("User not found with username/email: " + usernameOrEmail);
        }

        return user.get();
    }

    /**
     * Get current user info
     */
    public AuthResponse getCurrentUser(String token) throws Exception {
        throw new RuntimeException("Token validation not implemented for this token type");
    }

    /**
     * Refresh token
     */
    public AuthResponse refreshToken(String refreshToken) throws Exception {
        try {
            return refreshKeycloakToken(refreshToken);
        } catch (Exception e) {
            log.error("Token refresh failed", e);
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
                    .expiresIn(jwtExpiration)
                    .build();
        } else {
            throw new RuntimeException("Token refresh failed with status: " + response.getStatusCode());
        }
    }
}