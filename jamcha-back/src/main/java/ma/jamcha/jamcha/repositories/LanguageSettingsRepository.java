package ma.jamcha.jamcha.repositories;

import ma.jamcha.jamcha.entities.LanguageSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LanguageSettingsRepository extends JpaRepository<LanguageSetting, Long> {

    // Find by language code (e.g., "en", "ar")
    Optional<LanguageSetting> findByCode(String code);

    // Check if a language is marked as default
    Optional<LanguageSetting> findByIsDefaultTrue();

    // Optional: Find enabled languages only
    Iterable<LanguageSetting> findByIsEnabledTrue();

    // Count enabled languages
    long countByIsEnabledTrue();

    // Find the first enabled language, excluding a specific ID, ordered by ID
    Optional<LanguageSetting> findFirstByIdNotAndIsEnabledTrueOrderByIdAsc(Long id);
}