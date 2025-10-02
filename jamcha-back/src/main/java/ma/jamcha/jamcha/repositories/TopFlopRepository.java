// TopFlopRepository
package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.TopFlopEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopFlopRepository extends JpaRepository<TopFlopEntry, Long> {

    Optional<TopFlopEntry> findBySlug(String slug);
    boolean existsBySlug(String slug);

    List<TopFlopEntry> findByWeekOfAndLanguageOrderByPositionAsc(LocalDate weekOf, String language);

    List<TopFlopEntry> findByWeekOfAndEntryTypeAndLanguageOrderByPositionAsc(
            LocalDate weekOf, TopFlopEntry.EntryType entryType, String language);

    @Query("SELECT t FROM TopFlopEntry t WHERE t.weekOf >= :startDate AND t.weekOf <= :endDate AND t.language = :language ORDER BY t.weekOf DESC, t.position ASC")
    List<TopFlopEntry> findByWeekRange(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate,
                                       @Param("language") String language);

    @Query("SELECT t FROM TopFlopEntry t WHERE t.weekOf = (SELECT MAX(te.weekOf) FROM TopFlopEntry te WHERE te.language = :language) AND t.language = :language ORDER BY t.entryType, t.position")
    List<TopFlopEntry> findCurrentWeekEntries(@Param("language") String language);

    boolean existsByWeekOfAndEntryTypeAndPosition(LocalDate weekOf, TopFlopEntry.EntryType entryType, Integer position);
}
