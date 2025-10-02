package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.LanguageSettingsRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.LanguageSettingsResponseDto;
import ma.jamcha.jamcha.entities.LanguageSetting;
import ma.jamcha.jamcha.mappers.LanguageSettingsMapper;
import ma.jamcha.jamcha.repositories.LanguageSettingsRepository;
import ma.jamcha.jamcha.services.LanguageSettingsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LanguageSettingsServiceImpl implements LanguageSettingsService {

    private final LanguageSettingsRepository languageSettingsRepository;
    private final LanguageSettingsMapper languageSettingsMapper;

    @Override
    public List<LanguageSettingsResponseDto> getAll() {
        return languageSettingsRepository.findAll().stream()
                .map(languageSettingsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public LanguageSettingsResponseDto getById(Long id) {
        LanguageSetting lang = languageSettingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language setting not found with id: " + id));
        return languageSettingsMapper.toDto(lang);
    }

    @Override
    public LanguageSettingsResponseDto create(LanguageSettingsRequestDto dto) {
        if (dto.getCode() == null || dto.getName() == null) {
            throw new IllegalArgumentException("Code and name are required.");
        }

        // Ensure code uniqueness
        if (languageSettingsRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("A language with code '" + dto.getCode() + "' already exists.");
        }

        // If this is set as default, ensure no other default exists
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            languageSettingsRepository.findByIsDefaultTrue()
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        languageSettingsRepository.save(existing);
                    });
        }

        LanguageSetting lang = languageSettingsMapper.toEntity(dto);

        // Set creation time manually if not set
        if (lang.getCreatedAt() == null) lang.setCreatedAt(LocalDateTime.now());
        if (lang.getUpdatedAt() == null) lang.setUpdatedAt(LocalDateTime.now());

        LanguageSetting saved = languageSettingsRepository.save(lang);
        return languageSettingsMapper.toDto(saved);
    }

    @Override
    public LanguageSettingsResponseDto update(Long id, LanguageSettingsRequestDto dto) {
        LanguageSetting existing = languageSettingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language setting not found with id: " + id));

        // If attempting to disable the language, perform checks
        if (Boolean.FALSE.equals(dto.getIsEnabled()) && existing.getIsEnabled()) {
            // Prevent disabling the last active language
            if (languageSettingsRepository.countByIsEnabledTrue() <= 1) {
                throw new IllegalStateException("Cannot disable the last active language. At least one language must be enabled.");
            }

            // If disabling the default language, transfer default status
            if (existing.getIsDefault()) {
                LanguageSetting newDefault = languageSettingsRepository.findFirstByIdNotAndIsEnabledTrueOrderByIdAsc(id)
                        .orElseThrow(() -> new IllegalStateException("Could not find an active language to transfer default status to."));
                newDefault.setIsDefault(true);
                languageSettingsRepository.save(newDefault);
            }
        }

        // Prevent unsetting the default language directly
        if (existing.getIsDefault() && Boolean.FALSE.equals(dto.getIsDefault())) {
            throw new IllegalStateException("Cannot unset the default language. To change, set another language as default.");
        }

        // If setting a new language as default, unset the old one
        if (Boolean.TRUE.equals(dto.getIsDefault()) && !existing.getIsDefault()) {
            languageSettingsRepository.findByIsDefaultTrue().ifPresent(oldDefault -> {
                oldDefault.setIsDefault(false);
                languageSettingsRepository.save(oldDefault);
            });
        }

        // Apply updates from DTO
        languageSettingsMapper.updateLanguageSettingsFromDto(dto, existing);

        LanguageSetting updated = languageSettingsRepository.save(existing);
        return languageSettingsMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        LanguageSetting lang = languageSettingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language setting not found with id: " + id));

        if (Boolean.TRUE.equals(lang.getIsDefault())) {
            throw new RuntimeException("Cannot delete the default language.");
        }

        languageSettingsRepository.deleteById(id);
    }

}