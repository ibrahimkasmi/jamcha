// PodcastRepository
package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Podcast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PodcastRepository extends JpaRepository<Podcast, Long> {

    // Find by slug (SEO-friendly URLs)
    Optional<Podcast> findBySlug(String slug);

    // Check if slug exists
    boolean existsBySlug(String slug);

    // Find by category name
    @Query("SELECT p FROM Podcast p WHERE p.category.name = :name")
    List<Podcast> findByCategoryName(@Param("name") String name);

    // Find by language ordered by published date
    Page<Podcast> findByLanguageOrderByPublishedAtDesc(String language, Pageable pageable);

    // Find featured podcasts by language
    @Query("SELECT p FROM Podcast p WHERE p.language = :language AND p.featured = true ORDER BY p.publishedAt DESC")
    Page<Podcast> findByLanguageAndFeaturedTrue(@Param("language") String language, Pageable pageable);

    // Find by language and category name
    @Query("SELECT p FROM Podcast p WHERE p.language = :language AND p.category.name = :category ORDER BY p.publishedAt DESC")
    Page<Podcast> findByLanguageAndCategoryName(
            @Param("language") String language,
            @Param("category") String category,
            Pageable pageable);

    // Find by language and category slug
    @Query("SELECT p FROM Podcast p WHERE p.language = :language AND p.category.slug = :category ORDER BY p.publishedAt DESC")
    Page<Podcast> findByLanguageAndCategorySlug(
            @Param("language") String language,
            @Param("category") String category,
            Pageable pageable);

    // Find featured podcasts
    List<Podcast> findByFeaturedTrue();

    // Search by title (case-insensitive)
    List<Podcast> findByTitleContainingIgnoreCase(String title);

    // Find by author name
    @Query("SELECT p FROM Podcast p WHERE p.author.name = :authorName")
    List<Podcast> findByAuthorName(@Param("authorName") String authorName);

    // Find by language
    List<Podcast> findByLanguage(String language);

    // Find by tag
    @Query("SELECT p FROM Podcast p JOIN p.tags t WHERE t.name = :tagName")
    List<Podcast> findByTagName(@Param("tagName") String tagName);

    // Search by title or description
    @Query("SELECT p FROM Podcast p WHERE p.language = :language " +
            "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Podcast> findByLanguageAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            @Param("language") String language,
            @Param("query") String query,
            @Param("query") String query2);

    // Get most viewed podcasts
    Page<Podcast> findByLanguageOrderByViewCountDesc(String language, Pageable pageable);

    // Increment view count
    @Modifying
    @Query("UPDATE Podcast p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // Find recent podcasts by language
    @Query("SELECT p FROM Podcast p WHERE p.language = :language ORDER BY p.createdAt DESC")
    Page<Podcast> findRecentByLanguage(@Param("language") String language, Pageable pageable);

    // Find by duration range
    @Query("SELECT p FROM Podcast p WHERE p.language = :language AND p.duration BETWEEN :minDuration AND :maxDuration ORDER BY p.publishedAt DESC")
    Page<Podcast> findByLanguageAndDurationBetween(
            @Param("language") String language,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            Pageable pageable);
}
