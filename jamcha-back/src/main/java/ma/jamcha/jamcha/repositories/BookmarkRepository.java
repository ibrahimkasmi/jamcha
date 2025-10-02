// ma.jamcha.jamcha.repositories.BookmarkRepository

package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Bookmark;
import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUser(User user);
    List<Bookmark> findByArticle(Article article);

    // ✅ Add method that takes IDs
    Optional<Bookmark> findByUserIdAndArticleId(Long userId, Long articleId);

    void deleteByUserIdAndArticleId(Long userId, Long articleId);
}