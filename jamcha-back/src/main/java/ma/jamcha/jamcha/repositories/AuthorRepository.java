//AuthorRepository.java
package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.projections.AuthorStatsProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    @Query("SELECT a.id AS id, a.name AS name, a.avatar AS avatar, COUNT(art.id) AS articleCount " +
            "FROM Author a JOIN a.articles art " +
            "GROUP BY a.id, a.name, a.avatar " +
            "ORDER BY articleCount DESC")
    List<AuthorStatsProjection> findPopularAuthors(Pageable pageable);
}