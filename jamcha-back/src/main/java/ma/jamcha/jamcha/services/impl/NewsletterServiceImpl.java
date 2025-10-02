package ma.jamcha.jamcha.services.impl;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.NewsletterRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.NewsletterResponseDto;
import ma.jamcha.jamcha.entities.Newsletter;
import ma.jamcha.jamcha.mappers.NewsletterMapper;
import ma.jamcha.jamcha.repositories.NewsletterRepository;
import ma.jamcha.jamcha.services.NewsletterService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final NewsletterMapper newsletterMapper;

    @Override
    public List<NewsletterResponseDto> getAll() {
        return newsletterRepository.findAll().stream()
                .map(newsletterMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public NewsletterResponseDto getById(Long id) {
        Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));
        return newsletterMapper.toDto(newsletter);
    }

    @Override
    public NewsletterResponseDto create(NewsletterRequestDto dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        String email = dto.getEmail().trim().toLowerCase();
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        // Check if email already exists
        Optional<Newsletter> existingNewsletter = newsletterRepository.findByEmail(email);
        if (existingNewsletter.isPresent()) {
            Newsletter existing = existingNewsletter.get();
            if (existing.getIsActive()) {
                throw new RuntimeException("هذا البريد الإلكتروني مشترك بالفعل في النشرة الإخبارية");
            } else {
                // Reactivate existing subscription
                existing.setIsActive(true);
                existing.setSubscribedAt(LocalDateTime.now());
                Newsletter reactivated = newsletterRepository.save(existing);
                return newsletterMapper.toDto(reactivated);
            }
        }

        // Use mapper but ensure defaults are set after mapping
        Newsletter newsletter = newsletterMapper.toEntity(dto);
        newsletter.setEmail(email);

        // Ensure defaults are set (in case DTO doesn't have these fields)
        if (newsletter.getIsActive() == null) {
            newsletter.setIsActive(true);
        }
        if (newsletter.getSubscribedAt() == null) {
            newsletter.setSubscribedAt(LocalDateTime.now());
        }

        Newsletter saved = newsletterRepository.save(newsletter);
        return newsletterMapper.toDto(saved);
    }

    @Override
    public NewsletterResponseDto update(Long id, NewsletterRequestDto dto) {
        Newsletter existing = newsletterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));

        if (dto.getEmail() != null) {
            String newEmail = dto.getEmail().trim().toLowerCase();
            if (!newEmail.equals(existing.getEmail())) {
                if (newsletterRepository.findByEmail(newEmail).isPresent()) {
                    throw new RuntimeException("Another subscriber with this email already exists.");
                }
                existing.setEmail(newEmail);
            }
        }

        if (dto.getIsActive() != null) {
            existing.setIsActive(dto.getIsActive());
        }

        Newsletter updated = newsletterRepository.save(existing);
        return newsletterMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!newsletterRepository.existsById(id)) {
            throw new RuntimeException("Subscription not found with id: " + id);
        }
        newsletterRepository.deleteById(id);
    }
}
