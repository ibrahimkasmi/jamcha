
    // Podcast Entity
    package ma.jamcha.jamcha.entities;

    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.JdbcTypeCode;
    import org.hibernate.type.SqlTypes;

    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @Table(name = "podcasts")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Podcast {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String title;

        @Column(unique = true, nullable = false)
        private String slug;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Column(nullable = false)
        private String videoUrl;

        private String thumbnailUrl;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_id")
        private Category category;

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(
                name = "podcast_tags",
                joinColumns = @JoinColumn(name = "podcast_id"),
                inverseJoinColumns = @JoinColumn(name = "tag_id")
        )
        private List<Tag> tags;

        @OneToMany(mappedBy = "podcast", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<PodcastComment> comments;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "author_id", nullable = false)
        private Author author;

        @Column(name = "duration_minutes")
        private Integer duration; // Duration in minutes

        @Column(name = "view_count")
        private Long viewCount = 0L;

        @Column(name = "published_at", nullable = false)
        private LocalDateTime publishedAt;

        @Column(name = "is_featured")
        private Boolean featured = false;

        @Column(length = 10, nullable = false)
        private String language = "ar";

        @Column(columnDefinition = "json")
        @JdbcTypeCode(SqlTypes.JSON)
        @Basic(fetch = FetchType.LAZY)
        private String translations;

        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        @PrePersist
        protected void onCreate() {
            createdAt = LocalDateTime.now();
            updatedAt = LocalDateTime.now();
            if (publishedAt == null) {
                publishedAt = LocalDateTime.now();
            }
        }

        @PreUpdate
        protected void onUpdate() {
            updatedAt = LocalDateTime.now();
        }
    }