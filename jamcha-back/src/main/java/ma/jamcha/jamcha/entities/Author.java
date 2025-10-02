package ma.jamcha.jamcha.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.jamcha.jamcha.enums.UserRole;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "authors")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@PrimaryKeyJoinColumn(name = "id") // CRITICAL: This tells JPA how to join with parent table
public class Author extends User {

    @Column(name = "author_name")
    private String name;

    @Column(name = "avatar")
    private String avatar;

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY) // Use mappedBy instead of @JoinColumn
    private List<Article> articles;

    // Custom constructor for Lombok builder
    @Builder(builderMethodName = "authorBuilder")
    public Author(String username, String password, String email,
                  String firstName, String lastName, String provider, String providerId,
                  String keycloakId, Boolean isActive, String name, String avatar) {
        // Initialize parent first
        super();

        // Set parent fields
        this.setUsername(username);
        this.setPassword(password);
        this.setEmail(email);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setRole(UserRole.AUTHOR); // Always AUTHOR for this entity
        this.setProvider(provider != null ? provider : "local");
        this.setProviderId(providerId != null ? providerId : username);
        this.setKeycloakId(keycloakId);
        this.setIsActive(isActive != null ? isActive : true);
        this.setCreatedAt(LocalDateTime.now());

        // Set child fields
        this.name = name;
        this.avatar = avatar;
    }

    // Convenience constructor for simple author creation
    public Author(String username, String password, String email,
                  String firstName, String lastName, String name, String avatar) {
        this(username, password, email, firstName, lastName,
                "local", username, null, true, name, avatar);
    }

    // Another convenience constructor
    public Author(String username, String email, String name) {
        this(username, null, email, null, null,
                "local", username, null, true, name, null);
    }

    // Override setRole to ensure it's always AUTHOR
    @Override
    public void setRole(UserRole role) {
        super.setRole(UserRole.AUTHOR);
    }
}