// ma.jamcha.jamcha.repositories.TagRepository

package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // Find by name (case-sensitive)
    Optional<Tag> findByName(String name);

    // Check if tag exists by name
    boolean existsByName(String name);
}