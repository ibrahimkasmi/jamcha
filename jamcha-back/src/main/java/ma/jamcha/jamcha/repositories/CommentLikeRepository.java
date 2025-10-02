// ma.jamcha.jamcha.repositories.CommentLikeRepository

package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    // ✅ Add method that takes IDs
    Optional<CommentLike> findByCommentIdAndUserId(Long commentId, Long userId);

    // Optional: Find by comment
    java.util.List<CommentLike> findByCommentId(Long commentId);

    // Optional: Find by user
    java.util.List<CommentLike> findByUserId(Long userId);

    // Delete by IDs
    void deleteByCommentIdAndUserId(Long commentId, Long userId);
}