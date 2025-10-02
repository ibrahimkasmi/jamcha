package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Optional: Find by slug (useful for APIs using slugs instead of IDs)
    Optional<Category> findBySlug(String slug);

    // Optional: Check if name already exists (for uniqueness)
    boolean existsByName(String name);

    // Optional: Check if slug already exists
    boolean existsBySlug(String slug);
    // In your CategoryRepository
    @Query("SELECT c.id as id, c.name as name, c.slug as slug, c.color as color, " +
            "c.icon as icon, c.translations as translations, COUNT(a) as articleCount " +
            "FROM Category c LEFT JOIN c.articles a " +
            "GROUP BY c.id, c.name, c.slug, c.color, c.icon") // Remove c.translations from here
    List<Object[]> findCategoriesWithArticleCount();
}