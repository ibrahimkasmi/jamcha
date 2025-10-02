package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username (case-sensitive or case-insensitive)
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if username exists (for validation)
    boolean existsByUsername(String username);

    // Check if email exists (for validation)
    boolean existsByEmail(String email);

    // Find users by role
    List<User> findByRole(UserRole role);

    // Count users by role
    long countByRole(UserRole role);

    // Count active users
    long countByIsActive(boolean isActive);

    // Find active users
    List<User> findByIsActive(boolean isActive);

    // Find by Keycloak ID
    Optional<User> findByKeycloakId(String keycloakId);
}