package ma.jamcha.jamcha.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "language_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private Boolean isEnabled;
    private Boolean isDefault;
    private String direction;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (isEnabled == null) isEnabled = true;
        if (isDefault == null) isDefault = false;
        if (direction == null) direction = "ltr";
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
