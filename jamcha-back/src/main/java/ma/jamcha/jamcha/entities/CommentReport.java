package ma.jamcha.jamcha.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    private String reason;
    private String details;
    private LocalDateTime reportedAt;
    private String status;
    private String reviewedBy;
    private LocalDateTime reviewedAt;

    @PrePersist
    public void prePersist() {
        if (reportedAt == null) reportedAt = LocalDateTime.now();
        if (status == null) status = "pending";
    }
}
