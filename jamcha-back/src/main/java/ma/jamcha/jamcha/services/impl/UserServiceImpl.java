package ma.jamcha.jamcha.services.impl;

import jakarta.persistence.EntityNotFoundException;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.jamcha.jamcha.dtos.dtoRequest.PasswordChangeRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserUpdateRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;
import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.enums.UserRole;
import ma.jamcha.jamcha.mappers.UserMapper;
import ma.jamcha.jamcha.repositories.UserRepository;
import ma.jamcha.jamcha.repositories.AuthorRepository;
import ma.jamcha.jamcha.services.KeycloakUserService;
import ma.jamcha.jamcha.services.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;
    private final UserMapper userMapper;
    private final KeycloakUserService keycloakUserService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Override
    public List<UserResponseDto> getAll() {
        return userRepository
                .findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getById(Long id) {
        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id)
                );
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto create(UserRequestDto dto) {
        log.info("Creating new user: {} with role: {}", dto.getUsername(), dto.getRole());

        // Validate input
        validateUserInput(dto);

        String username = dto.getUsername().trim();
        String email = dto.getEmail().trim();

        // Check if user already exists
        checkUserExists(username, email);

        User user = null;
        String keycloakUserId = null;

        try {
            // Determine role
            UserRole role = dto.getRole() != null ?
                    UserRole.valueOf(dto.getRole().toUpperCase()) : UserRole.AUTHOR;

            // Create appropriate entity based on role using inheritance
            if (role == UserRole.AUTHOR) {
                // Create Author entity (which extends User)
                Author author = Author.authorBuilder()
                        .username(username)
                        .email(email)
                        .firstName(dto.getFirstName())
                        .lastName(dto.getLastName())
                        .name(dto.getAuthorName() != null ?
                                dto.getAuthorName() :
                                extractDisplayName(dto.getFirstName(), dto.getLastName(), username))
                        .avatar(dto.getAvatar())
                        .provider(dto.getProvider())
                        .providerId(dto.getProviderId())
                        .build();

                // Set password after creation since it's in parent class
                author.setPassword(passwordEncoder.encode(dto.getPassword()));

                user = authorRepository.save(author);
                log.info("Author created successfully: {}", user.getUsername());

            } else {
                // Create regular User entity (for ADMIN role)
                user = User.builder()
                        .username(username)
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .email(email)
                        .firstName(dto.getFirstName())
                        .lastName(dto.getLastName())
                        .role(role)
                        .provider(dto.getProvider())
                        .providerId(dto.getProviderId())
                        .build();

                user = userRepository.save(user);
                log.info("User created successfully: {}", user.getUsername());
            }

            // Try to create user in Keycloak
            try {
                keycloakUserId = keycloakUserService.createUserInKeycloak(user, dto.getPassword());
                user.setKeycloakId(keycloakUserId);

                // Save updated user with Keycloak ID
                if (user instanceof Author) {
                    user = authorRepository.save((Author) user);
                } else {
                    user = userRepository.save(user);
                }

                log.info("User successfully synced with Keycloak: {}", keycloakUserId);
            } catch (Exception e) {
                log.warn("Could not create user in Keycloak (continuing without Keycloak): {}", e.getMessage());
            }

            return userMapper.toDto(user);

        } catch (Exception e) {
            log.error("Failed to create user", e);

            // Cleanup on failure
            if (user != null && user.getId() != null) {
                try {
                    if (user instanceof Author) {
                        authorRepository.deleteById(user.getId());
                    } else {
                        userRepository.deleteById(user.getId());
                    }
                } catch (Exception cleanupException) {
                    log.error("Failed to cleanup user during creation failure", cleanupException);
                }
            }

            // Cleanup Keycloak if created
            if (keycloakUserId != null) {
                try {
                    keycloakUserService.deleteUserFromKeycloak(keycloakUserId);
                } catch (Exception cleanupException) {
                    log.error("Failed to cleanup Keycloak user", cleanupException);
                }
            }

            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public UserResponseDto update(Long id, UserRequestDto dto) {
        User existing = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id)
                );

        // Update basic fields
        if (dto.getUsername() != null) {
            String newUsername = dto.getUsername().trim();
            if (!newUsername.equals(existing.getUsername())) {
                if (userRepository.existsByUsername(newUsername)) {
                    throw new RuntimeException("Username already taken: " + newUsername);
                }
                existing.setUsername(newUsername);
            }
        }

        if (dto.getEmail() != null) {
            String newEmail = dto.getEmail().trim();
            if (!newEmail.equals(existing.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new RuntimeException("Email already taken: " + newEmail);
                }
                existing.setEmail(newEmail);
            }
        }

        if (dto.getFirstName() != null) {
            existing.setFirstName(dto.getFirstName().trim());
        }

        if (dto.getLastName() != null) {
            existing.setLastName(dto.getLastName().trim());
        }

        // Handle author-specific fields if this is an Author
        if (existing instanceof Author) {
            Author author = (Author) existing;
            if (dto.getAuthorName() != null) {
                author.setName(dto.getAuthorName());
            }
            if (dto.getAvatar() != null) {
                author.setAvatar(dto.getAvatar());
            }
        }

        // Handle optional password update
        String plainPassword = dto.getPassword();
        updatePasswordIfProvided(existing, plainPassword);

        // Save to database first
        User updated;
        if (existing instanceof Author) {
            updated = authorRepository.save((Author) existing);
        } else {
            updated = userRepository.save(existing);
        }

        // Then synchronize with Keycloak
        try {
            if (updated.getKeycloakId() != null) {
                keycloakUserService.updateUserInKeycloak(updated);

                if (isPasswordProvided(plainPassword)) {
                    keycloakUserService.updateUserPasswordInKeycloak(
                            updated.getKeycloakId(),
                            plainPassword
                    );
                }

                log.info("User {} successfully synchronized with Keycloak", updated.getUsername());
            } else {
                log.warn("User {} has no Keycloak ID, skipping Keycloak update", updated.getUsername());
            }
        } catch (Exception e) {
            log.error("Failed to update user in Keycloak: {}", e.getMessage(), e);
        }

        return userMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id)
                );

        try {
            // Delete from Keycloak if keycloakId exists
            if (user.getKeycloakId() != null) {
                keycloakUserService.deleteUserFromKeycloak(user.getKeycloakId());
            }
            log.info(user.getKeycloakId());
            // Delete from local database
            if (user instanceof Author) {
                authorRepository.deleteById(id);
            } else {
                userRepository.deleteById(id);
            }

            log.info("User deleted successfully: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to delete user", e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }

    // Replace your existing partialUpdateWithReflection method with this one:

    @Override
    @Transactional
    public UserResponseDto partialUpdateWithReflection(String username, UserUpdateRequestDto dto) {
        User existingUser = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found with username: " + username)
                );

        // Check for unique constraints before updating
        if (dto.getUsername() != null && !dto.getUsername().equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Username already taken: " + dto.getUsername());
            }
        }

        if (dto.getEmail() != null && !dto.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already taken: " + dto.getEmail());
            }
        }

        // Special handling for password and role before using reflection
        String password = dto.getPassword();
        String newRole = dto.getRole();
        dto.setPassword(null); // Remove from DTO to prevent direct copying
        dto.setRole(null);     // Remove from DTO to handle separately

        // Use reflection to copy non-null properties (except password and role)
        BeanUtils.copyProperties(dto, existingUser, getNullPropertyNames(dto));

        // Handle role changes first
        User updatedUser = handleRoleChange(existingUser, newRole, dto);

        // Handle author-specific fields if this is an Author
        if (updatedUser instanceof Author) {
            log.info("Author found: {}", updatedUser.getUsername());
            Author author = (Author) updatedUser;
            if (dto.getAuthorName() != null) {
                author.setName(dto.getAuthorName());
            }
            if (dto.getAvatar() != null) {
                author.setAvatar(dto.getAvatar());
            }
        }

        // Handle password separately with proper encoding
        updatePasswordIfProvided(updatedUser, password);

        log.info("Partial update for user {} started", updatedUser.getEmail());

        // Save to database first
        User savedUser;
        if (updatedUser instanceof Author) {
            savedUser = authorRepository.save((Author) updatedUser);
        } else {
            savedUser = userRepository.save(updatedUser);
        }

        // Then synchronize with Keycloak
        try {
            if (savedUser.getKeycloakId() != null) {
                keycloakUserService.updateUserInKeycloak(savedUser);

                // Update role in Keycloak if role was changed
                if (newRole != null) {
                    updateUserRoleInKeycloak(savedUser.getKeycloakId(), newRole);
                }

                if (isPasswordProvided(password)) {
                    keycloakUserService.updateUserPasswordInKeycloak(
                            savedUser.getKeycloakId(),
                            password
                    );
                }

                log.info("User {} successfully synchronized with Keycloak", savedUser.getUsername());
            } else {
                log.warn("User {} has no Keycloak ID, skipping Keycloak update", savedUser.getUsername());
            }
        } catch (Exception e) {
            log.error("Failed to update user in Keycloak: {}", e.getMessage(), e);
        }

        log.info("User {} partially updated successfully: {}", username, savedUser.getUsername());
        return userMapper.toDto(savedUser);
    }



// Add these helper methods to your UserServiceImpl class:

    private User handleRoleChange(User existingUser, String newRole, UserUpdateRequestDto dto) {
        if (newRole == null) {
            return existingUser; // No role change
        }

        // Normalize role comparison
        String currentRole = existingUser.getRole().toString();
        String normalizedNewRole = newRole.toUpperCase();

        if (normalizedNewRole.equals(currentRole)) {
            return existingUser; // No role change
        }

        UserRole newUserRole;
        try {
            newUserRole = UserRole.valueOf(normalizedNewRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + newRole + ". Valid roles: ADMIN, AUTHOR");
        }

        log.info("Role change requested for user {}: {} -> {}",
                existingUser.getUsername(), existingUser.getRole(), newUserRole);

        // Handle role change logic
        switch (newUserRole) {
            case AUTHOR:
                return convertToAuthor(existingUser, dto);
            case ADMIN:
                return convertToAdmin(existingUser);
            default:
                throw new RuntimeException("Unsupported role: " + newRole);
        }
    }

    private User convertToAuthor(User existingUser, UserUpdateRequestDto dto) {
        if (existingUser instanceof Author) {
            // Already an author, just ensure role is set correctly
            existingUser.setRole(UserRole.AUTHOR);
            return existingUser;
        }

        // Create new Author entity from existing User
        String authorName = dto.getAuthorName() != null ?
                dto.getAuthorName() :
                extractDisplayName(existingUser.getFirstName(), existingUser.getLastName(), existingUser.getUsername());

        Author author = Author.authorBuilder()
                .username(existingUser.getUsername())
                .password(existingUser.getPassword()) // Already encoded
                .email(existingUser.getEmail())
                .firstName(existingUser.getFirstName())
                .lastName(existingUser.getLastName())
                .provider(existingUser.getProvider())
                .providerId(existingUser.getProviderId())
                .keycloakId(existingUser.getKeycloakId())
                .isActive(existingUser.getIsActive())
                .name(authorName)
                .avatar(dto.getAvatar())
                .build();

        // Set creation time from existing user
        author.setCreatedAt(existingUser.getCreatedAt());

        // Delete old user entity first
        userRepository.delete(existingUser);
        userRepository.flush(); // Ensure deletion is committed

        log.info("Converted user {} to Author", existingUser.getUsername());
        return author;
    }

    private User convertToAdmin(User existingUser) {
        if (!(existingUser instanceof Author)) {
            // Already a regular user, just update role
            existingUser.setRole(UserRole.ADMIN);
            return existingUser;
        }

        // Convert Author to regular User (Admin)
        Author author = (Author) existingUser;

        User adminUser = User.builder()
                .username(author.getUsername())
                .password(author.getPassword()) // Already encoded
                .email(author.getEmail())
                .firstName(author.getFirstName())
                .lastName(author.getLastName())
                .role(UserRole.ADMIN)
                .provider(author.getProvider())
                .providerId(author.getProviderId())
                .keycloakId(author.getKeycloakId())
                .isActive(author.getIsActive())
                .build();

        // Set creation time from existing user
        adminUser.setCreatedAt(author.getCreatedAt());

        // Delete old author entity first
        authorRepository.delete(author);
        authorRepository.flush(); // Ensure deletion is committed

        log.info("Converted Author {} to Admin", author.getUsername());
        return adminUser;
    }

    private void updateUserRoleInKeycloak(String keycloakId, String role) {
        try {
            // Simple role update - you can expand this based on your Keycloak setup
            keycloakUserService.updateUserRoleInKeycloak(keycloakId, "ROLE_" + role.toUpperCase());
            log.info("Successfully updated role for user {} in Keycloak to ROLE_{}", keycloakId, role.toUpperCase());
        } catch (Exception e) {
            log.error("Failed to update user role in Keycloak: {}", e.getMessage(), e);
            // Don't throw exception here - let the database update succeed even if Keycloak fails
        }
    }

    // Helper methods
    private void validateUserInput(UserRequestDto dto) {
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
    }

    private void checkUserExists(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }
    }

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

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }

        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    private void updatePasswordIfProvided(User existing, String newPassword) {
        if (isPasswordProvided(newPassword)) {
            existing.setPassword(passwordEncoder.encode(newPassword));
        }
    }

    private boolean isPasswordProvided(String password) {
        return password != null && !password.trim().isEmpty();
    }

    // for handling the password changes from the new part in the profile page

    @Override
    @Transactional
    public void changePassword(String username, PasswordChangeRequestDto dto) {
        log.info("Password change requested for user: {}", username);

        // Validate password confirmation
        if (!dto.isPasswordConfirmed()) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Find the user
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found with username: " + username)
                );

        // Verify current password
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Prevent setting the same password
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        // Save to database
        if (user instanceof Author) {
            authorRepository.save((Author) user);
        } else {
            userRepository.save(user);
        }

        // Update in Keycloak
        try {
            if (user.getKeycloakId() != null) {
                keycloakUserService.updateUserPasswordInKeycloak(
                        user.getKeycloakId(),
                        dto.getNewPassword()
                );
                log.info("Password successfully updated in Keycloak for user: {}", username);
            } else {
                log.warn("User {} has no Keycloak ID, password updated only locally", username);
            }
        } catch (Exception e) {
            log.error("Failed to update password in Keycloak for user {}: {}", username, e.getMessage());
        }

        log.info("Password changed successfully for user: {}", username);
    }
}