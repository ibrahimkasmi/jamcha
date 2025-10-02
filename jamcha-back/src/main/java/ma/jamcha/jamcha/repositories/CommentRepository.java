
// 4. CommentRepository
package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.article.id = :articleId ORDER BY c.createdAt ASC")
    List<Comment> findByArticleId(@Param("articleId") Long articleId);

    @Query("SELECT c FROM Comment c WHERE c.parent IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelCommentsOrderByCreatedAtDesc();

    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(@Param("parentId") Long parentId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.article.id = :articleId")
    Long countByArticleId(@Param("articleId") Long articleId);

    @Query("SELECT c FROM Comment c WHERE c.isApproved = true ORDER BY c.createdAt DESC")
    List<Comment> findApprovedCommentsOrderByCreatedAtDesc();
}