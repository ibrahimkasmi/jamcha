// ma.jamcha.jamcha.repositories.CommentReportRepository

package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Comment;
import ma.jamcha.jamcha.entities.CommentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentReportRepository extends JpaRepository<CommentReport, Long> {

    // Find all reports for a comment
    List<CommentReport> findByComment(Comment comment);

    // Find by status
    List<CommentReport> findByStatus(String status);

    // Find by comment and status
    List<CommentReport> findByCommentAndStatus(Comment comment, String status);
}