package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Article entity operations.
 * Methods are organized by functionality for better maintainability.
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // ========== BASIC FINDING OPERATIONS ==========

    /**
     * Find article by SEO-friendly slug (only active articles for public)
     */
    Optional<Article> findBySlugAndIsActiveTrue(String slug);

    /**
     * Find article by ID (only active articles for public)
     */
    Optional<Article> findByIdAndIsActiveTrue(Long id);

    /**
     * Find article by slug (admin/author access - no isActive filter)
     */
    Optional<Article> findBySlug(String slug);

    /**
     * Check if article with given slug exists
     */
    boolean existsBySlug(String slug);

    // ========== LANGUAGE-BASED OPERATIONS (PUBLIC - ONLY ACTIVE) ==========

    /**
     * Find ACTIVE articles by language, ordered by publication date (newest first)
     */
    Page<Article> findByLanguageAndIsActiveTrueOrderByPublishedAtDesc(String language, Pageable pageable);

    /**
     * Find ACTIVE breaking news articles by language
     */
    Page<Article> findByLanguageAndBreakingTrueAndIsActiveTrue(String language, Pageable pageable);

    // ========== LANGUAGE-BASED OPERATIONS (ADMIN/AUTHOR - ALL ARTICLES) ==========

    /**
     * Find ALL articles by language, ordered by publication date (admin/author view)
     */
    Page<Article> findByLanguageOrderByPublishedAtDesc(String language, Pageable pageable);

    /**
     * Find ALL breaking news articles by language (admin/author view)
     */
    Page<Article> findByLanguageAndBreakingTrue(String language, Pageable pageable);

    // ========== CATEGORY-BASED OPERATIONS (PUBLIC - ONLY ACTIVE) ==========

    /**
     * Find ACTIVE articles by category name
     */
    @Query("SELECT a FROM Article a WHERE a.category.name = :name AND a.isActive = true")
    List<Article> findActiveByCategoryName(@Param("name") String name);

    /**
     * Find ACTIVE articles by language and category slug (SEO-friendly)
     */
    @Query("SELECT a FROM Article a WHERE a.language = :language AND a.category.slug = :category AND a.isActive = true")
    Page<Article> findByLanguageAndCategorySlugAndIsActiveTrue(
            @Param("language") String language,
            @Param("category") String category,
            Pageable pageable);

    // ========== CATEGORY-BASED OPERATIONS (ADMIN/AUTHOR - ALL ARTICLES) ==========

    /**
     * Find ALL articles by category name (admin/author view)
     */
    @Query("SELECT a FROM Article a WHERE a.category.name = :name")
    List<Article> findByCategoryName(@Param("name") String name);

    /**
     * Find ALL articles by language and category name (admin/author view)
     */
    @Query("SELECT a FROM Article a WHERE a.language = :language AND a.category.name = :category")
    Page<Article> findByLanguageAndCategoryName(
            @Param("language") String language,
            @Param("category") String category,
            Pageable pageable);

    /**
     * Find ALL articles by language and category slug (admin/author view)
     */
    @Query("SELECT a FROM Article a WHERE a.language = :language AND a.category.slug = :category")
    Page<Article> findByLanguageAndCategorySlug(
            @Param("language") String language,
            @Param("category") String category,
            Pageable pageable);

    // ========== SEARCH OPERATIONS (PUBLIC - ONLY ACTIVE) ==========

    /**
     * Search ACTIVE articles by title or content
     */
    @Query("SELECT a FROM Article a WHERE a.language = :language AND a.isActive = true " +
            "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :titleQuery, '%')) " +
            "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :contentQuery, '%')))")
    List<Article> findActiveByLanguageAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            @Param("language") String language,
            @Param("titleQuery") String query,
            @Param("contentQuery") String query1);

    /**
     * Search ALL articles by title or content (admin/author view)
     */
    @Query("SELECT a FROM Article a WHERE a.language = :language " +
            "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :titleQuery, '%')) " +
            "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :contentQuery, '%')))")
    List<Article> findByLanguageAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            @Param("language") String language,
            @Param("titleQuery") String query,
            @Param("contentQuery") String query1);

    // ========== TAG-BASED OPERATIONS (PUBLIC - ONLY ACTIVE) ==========

    /**
     * Find ACTIVE articles by tag name
     */
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.name = :tagName AND a.isActive = true")
    List<Article> findActiveByTagName(@Param("tagName") String tagName);

    /**
     * Find ALL articles by tag name (admin/author view)
     */
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.name = :tagName")
    List<Article> findByTagName(@Param("tagName") String tagName);

    // ========== SPECIAL CONTENT OPERATIONS ==========

    /**
     * Find breaking news article (admin/author view - no isActive filter for management)
     */
    Optional<Article> findByBreakingTrue();

    /**
     * Find ACTIVE articles by language only (public)
     */
    List<Article> findByLanguageAndIsActiveTrue(String language);

    /**
     * Find ALL articles by language (admin/author view)
     */
    List<Article> findByLanguage(String language);

    // ========== ADMIN/AUTHOR ROLE-BASED OPERATIONS (NO isActive FILTER) ==========

    /**
     * Find ALL articles by category slug (admin view)
     */
    Page<Article> findByCategorySlug(String categorySlug, Pageable pageable);

    /**
     * Find ALL articles ordered by date (admin view)
     */
    Page<Article> findAllByOrderByPublishedAtDesc(Pageable pageable);

    /**
     * Find ALL articles by author, language and category (author/admin view)
     */
    Page<Article> findByAuthorUsernameAndLanguageAndCategorySlug(
            String username, String language, String categorySlug, Pageable pageable);

    /**
     * Find ALL articles by author and language (author/admin view)
     */
    Page<Article> findByAuthorUsernameAndLanguageOrderByPublishedAtDesc(
            String username, String language, Pageable pageable);

    /**
     * Find the most recent, active articles, excluding a specific ID.
     * Used to find a candidate for the new breaking article.
     */
    Page<Article> findByIdNotAndIsActiveTrueOrderByPublishedAtDesc(Long id, Pageable pageable);
}