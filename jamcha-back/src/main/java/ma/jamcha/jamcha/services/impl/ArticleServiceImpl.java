package ma.jamcha.jamcha.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import ma.jamcha.jamcha.dtos.dtoRequest.ArticleRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.ArticleResponseDto;
import ma.jamcha.jamcha.entities.Article;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.enums.ArticleStatus;
import ma.jamcha.jamcha.mappers.ArticleMapper;
import ma.jamcha.jamcha.mappers.AuthorMapper;
import ma.jamcha.jamcha.mappers.MapperUtil;
import ma.jamcha.jamcha.mappers.SocialMediaLinkMapper;
import ma.jamcha.jamcha.repositories.ArticleRepository;
import ma.jamcha.jamcha.repositories.AuthorRepository;
import ma.jamcha.jamcha.security.UserInfo;
import ma.jamcha.jamcha.services.ArticleService;
import ma.jamcha.jamcha.services.MinioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;
    private final MinioService minioService;
    private final AuthorMapper authorMapper;
    private final SocialMediaLinkMapper socialMediaLinkMapper;

    private final AuthorRepository authorRepository;

    @Override
    public List<ArticleResponseDto> getAll() {
        return articleRepository.findAll().stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }


    private List<ArticleResponseDto> getArticlesForAdmin(String language, int limit, int page, String category) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Article> articlePage;

        boolean hasLanguage = language != null && !language.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !category.equals("all");

        if (hasLanguage && hasCategory) {
            articlePage = articleRepository.findByLanguageAndCategorySlug(language, category, pageable);
        } else if (hasLanguage) {
            articlePage = articleRepository.findByLanguageOrderByPublishedAtDesc(language, pageable);
        } else if (hasCategory) {
            articlePage = articleRepository.findByCategorySlug(category, pageable);
        } else {
            articlePage = articleRepository.findAllByOrderByPublishedAtDesc(pageable);
        }

        return articlePage.getContent().stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> fetchArticlesBasedOnRole(
            UserInfo userInfo, String language, int limit, int page, String category) {
        log.debug(
                "Fetching articles for user: {} with roles: {} and language: {} and limit: {} and page: {} and category: {}",
                userInfo.username(), userInfo.roles(), language, limit, page, category);

        // For ALL authenticated users, return all articles without isActive filter
        // This allows admins, authors, and regular users to see all articles in /my-articles endpoint

        // Check if user has ADMIN role - admins see all articles
        log.info("Fetching articles for user role: {}", userInfo.roles());
        if (userInfo.isAdmin()) {
            log.debug("Fetching all articles for admin user: {}", userInfo.username());
            return getArticlesForAdmin(language, limit, page, category);
        }

        // For authors, you might want them to see only their own articles OR all articles
        // If you want authors to see ALL articles (not just their own), use getAllWithFilters instead
        if (userInfo.isAuthor()) {
            log.info("Fetching all articles for author user in checking: {}", userInfo.username());
            log.debug("Fetching articles for author: {}", userInfo.username());
            // Option 1: Author sees only their own articles (current behavior)
            return getByAuthorAndFilters(userInfo.username(), language, limit, page, category);

            // Option 2: Author sees all articles (uncomment line below and comment line above)
            // return getAllWithFilters(language, limit, page, category);
        }

        // For regular authenticated users, return all articles without isActive filter
        log.debug("Fetching all articles for authenticated user: {}", userInfo.username());
        return getAllWithFilters(language, limit, page, category);
    }

    // ========== EXISTING METHODS (KEEP FOR BACKWARD COMPATIBILITY) ==========

    @Override
    public List<ArticleResponseDto> getByLanguageAndCategory(String language, int limit, String category) {
        // This calls the new paginated method with page = 0
        return getByLanguageAndCategory(language, limit, 0, category);
    }

    @Override
    public List<ArticleResponseDto> getLatestByLanguage(String language, int limit) {
        // This calls the new paginated method with page = 0
        return getLatestByLanguage(language, limit, 0);
    }

    // Keep your existing implementations for getByAuthorAndFilters and
    // getAllWithFilters
    // but update them to use page = 0 by calling the new paginated versions

    public List<ArticleResponseDto> getByAuthorAndFilters(String authorUsername, String language, int limit,
            String category) {
        return getByAuthorAndFilters(authorUsername, language, limit, 0, category);
    }

    public List<ArticleResponseDto> getAllWithFilters(String language, int limit, String category) {
        return getAllWithFilters(language, limit, 0, category);
    }

    // ========== NEW PAGINATED METHODS ==========

    @Override
    public List<ArticleResponseDto> getByLanguageAndCategory(String language, int limit, int page, String category) {
        Pageable pageable = PageRequest.of(page, limit);

        List<Article> articles;
        if (category != null && !category.isBlank() && !category.equals("all")) {
            Page<Article> articlePage = articleRepository.findByLanguageAndCategorySlugAndIsActiveTrue(language,
                    category, pageable);
            articles = articlePage.getContent();
        } else {
            Page<Article> articlePage = articleRepository.findByLanguageAndIsActiveTrueOrderByPublishedAtDesc(language,
                    pageable);
            articles = articlePage.getContent();
        }

        return articles.stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> getLatestByLanguage(String language, int limit, int page) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Article> articlePage = articleRepository.findByLanguageAndIsActiveTrueOrderByPublishedAtDesc(language,
                pageable);
        return articlePage.getContent().stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> getByLanguage(String language, int limit, int page) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Article> articlePage = articleRepository.findByLanguageOrderByPublishedAtDesc(language, pageable);
        return articlePage.getContent().stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    // ========== ROLE-BASED PAGINATED METHODS ==========

    @Override
    public List<ArticleResponseDto> getAllWithFilters(String language, int limit, int page, String category) {
        Pageable pageable = PageRequest.of(page, limit);

        List<Article> articles;
        if (category != null && !category.isBlank() && !category.equals("all")) {
            Page<Article> articlePage = articleRepository.findByCategorySlug(category, pageable);
            articles = articlePage.getContent();
        } else {
            Page<Article> articlePage = articleRepository.findAllByOrderByPublishedAtDesc(pageable);
            articles = articlePage.getContent();
        }

        return articles.stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> getByAuthorAndFilters(String authorUsername, String language, int limit, int page,
            String category) {
        Pageable pageable = PageRequest.of(page, limit);

        List<Article> articles;
        if (category != null && !category.isBlank() && !category.equals("all")) {
            Page<Article> articlePage = articleRepository.findByAuthorUsernameAndLanguageAndCategorySlug(
                    authorUsername, language, category, pageable);
            articles = articlePage.getContent();
        } else {
            Page<Article> articlePage = articleRepository.findByAuthorUsernameAndLanguageOrderByPublishedAtDesc(
                    authorUsername, language, pageable);
            articles = articlePage.getContent();
        }

        return articles.stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ArticleResponseDto getById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
        return articleMapper.toDto(article);
    }

    @Override
    public ArticleResponseDto create(ArticleRequestDto dto) {
        validateTitle(dto.getTitle());

        String slug = generateOrValidateSlug(dto);
        validateSlugUniqueness(slug);

        Article article = buildArticleFromDto(dto, slug);
        Article savedArticle = articleRepository.save(article);

        return articleMapper.toDto(savedArticle);
    }

    private void validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required.");
        }
    }

    private String generateOrValidateSlug(ArticleRequestDto dto) {
        return dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
    }

    private void validateSlugUniqueness(String slug) {
        if (articleRepository.existsBySlug(slug)) {
            throw new RuntimeException("An article with this slug already exists: " + slug);
        }
    }

    private void validateAuthor(Long authorId) {
        if (authorId == null) {
            throw new IllegalArgumentException("Author ID is required.");
        }
        if (!authorRepository.existsById(authorId)) {
            throw new EntityNotFoundException("Author not found with id: " + authorId);
        }
    }

    private Article buildArticleFromDto(ArticleRequestDto dto, String slug) {
        Article article = articleMapper.toEntity(dto);
        article.setSlug(slug);
        article.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now());
        article.setBreaking(dto.getIsBreaking() != null ? dto.getIsBreaking() : false);
        article.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");

        // Just validate author exists - don't try to set it on the article
        // The articleMapper.toEntity(dto) already sets article.authorId from
        // dto.authorId
        validateAuthor(dto.getAuthorId());

        return article;
    }

    @Override
    public ArticleResponseDto update(Long id, ArticleRequestDto dto) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (!newSlug.equals(existing.getSlug()) && articleRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another article with this slug already exists: " + newSlug);
        }

        articleMapper.updateArticleFromDto(dto, existing);
        existing.setSlug(newSlug);

        Article updated = articleRepository.save(existing);
        return articleMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // If the article to be deleted is the breaking one, assign a new one.
        if (article.getBreaking()) {
            assignNewBreakingArticle(id);
        }

        // Delete associated image from MinIO
        if (article.getFeaturedImage() != null) {
            try {
                deleteArticleImage(article.getFeaturedImage());
            } catch (Exception e) {
                log.error("Failed to delete article image: {}", e.getMessage());
            }
        }

        articleRepository.deleteById(id);
        log.info("Deleted article with ID: {}", id);
    }

    private String generateSlug(String title) {
        if (title == null)
            return null;
        return title.toLowerCase()
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-zA-Z0-9\\-]", "")
                .replaceAll("-+", "-");
    }

    @Override
    public ArticleResponseDto findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Slug cannot be null or empty");
        }

        Article article = articleRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Article not found with slug: " + slug));

        return articleMapper.toDto(article);
    }

    @Override
    public List<ArticleResponseDto> getByLanguage(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Article> page = articleRepository.findByLanguageOrderByPublishedAtDesc(language, pageable);
        return page.getContent().stream() // ✅ Extract List<Article> from Page
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> getFeaturedByLanguage(String language, int limit, int page) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Article> breakingPage = articleRepository.findByLanguageAndBreakingTrueAndIsActiveTrue(language, pageable);
        List<Article> articles = breakingPage.getContent();

        if (articles.isEmpty()) {
            Page<Article> latestPage = articleRepository.findByLanguageAndIsActiveTrueOrderByPublishedAtDesc(language,
                    pageable);
            articles = latestPage.getContent();
        }

        return articles.stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDto> searchByTitleOrContent(String query, String language) {
        List<Article> articles = articleRepository
                .findActiveByLanguageAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                        language, query, query);

        return articles.stream()
                .map(articleMapper::toDto)
                .collect(Collectors.toList());
    }

    // upload the image article method with unique filename
    private String uploadArticleImage(MultipartFile imageFile, String articleSlug) throws Exception {
        String originalFilename = imageFile.getOriginalFilename();
        String fileExtension = "";
        String filename = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            filename = originalFilename.substring(0, originalFilename.indexOf("."));
        }
        String uniqueFilename = filename + "_" + UUID.randomUUID().toString() + fileExtension;
        minioService.uploadFile(uniqueFilename, imageFile.getInputStream(), imageFile.getContentType(),
                imageFile.getSize());
        return uniqueFilename;
    }

    // delete the article image
    private void deleteArticleImage(String filename) throws Exception {
        if (minioService.fileExists(filename)) {
            minioService.deleteFile(filename);
        }
    }

    // create article with image
    @Override
    public ArticleResponseDto createWithImage(ArticleRequestDto dto, MultipartFile imageFile) {
        log.info("Creating article with image. AuthorId: {}, Image: {}",
                dto.getAuthorId(),
                imageFile != null ? imageFile.getOriginalFilename() : "none");

        // Generate slug
        String slug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (articleRepository.existsBySlug(slug)) {
            throw new RuntimeException("An article with slug '" + slug + "' already exists");
        }

        // Handle breaking news logic
        if (Boolean.TRUE.equals(dto.getIsBreaking())) {
            articleRepository.findByBreakingTrue()
                    .ifPresent(existing -> {
                        existing.setBreaking(false);
                        articleRepository.save(existing);
                    });
        }

        // Create article entity
        Article article = articleMapper.toEntity(dto);
        article.setSlug(slug);
        article.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now());
        article.setBreaking(Boolean.TRUE.equals(dto.getIsBreaking()));
        article.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "ar");
        article.setReadingTime(
                dto.getReadingTime() != null ? dto.getReadingTime() : calculateReadingTime(dto.getContent()));

        // Set author
        if (dto.getAuthorId() != null) {
            article.setAuthor(authorRepository.findById(dto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found with id: " + dto.getAuthorId())));
        }

        // Process social media links
        processSocialMediaLinks(article, dto);

        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            log.debug("Uploading article image: {}", imageFile.getOriginalFilename());
            try {
                String imageFilename = uploadArticleImage(imageFile, slug);
                article.setFeaturedImage(imageFilename);
                log.debug("Image uploaded successfully: {}", imageFilename);
            } catch (IOException e) {
                log.error("Failed to upload article image", e);
                throw new RuntimeException("Failed to upload article image: " + e.getMessage(), e);
            } catch (Exception e) {
                log.error("Unexpected error during image upload", e);
                throw new RuntimeException("Unexpected error during image upload: " + e.getMessage(), e);
            }
        }
        article.setStatus(ArticleStatus.InProgress);
        article.setIsActive(false);
        Article saved = articleRepository.save(article);
        log.info("Article created successfully with id: {}", saved.getId());
        return articleMapper.toDto(saved);
    }

    @Override
    public ArticleResponseDto updateWithImage(Long id, ArticleRequestDto dto, MultipartFile imageFile) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with this id : " + id));

        // Prevent setting an inactive article as breaking news
        if (Boolean.TRUE.equals(dto.getIsBreaking()) && !existing.getIsActive()) {
            log.warn("Attempted to set an inactive article (ID: {}) as breaking news. Operation denied.", id);
            throw new IllegalStateException("An inactive article cannot be set as breaking news. Please activate the article first.");
        }

        String newSlug = dto.getSlug() != null ? dto.getSlug() : generateSlug(dto.getTitle());
        if (!newSlug.equals(existing.getSlug()) && articleRepository.existsBySlug(newSlug)) {
            throw new RuntimeException("Another article with same slug exists");
        }
        log.debug("is breaking: " + dto.getIsBreaking() + "state");

        // Check if there's an existing breaking news article and un-flag it
        if (Boolean.TRUE.equals(dto.getIsBreaking())) {
            articleRepository.findByBreakingTrue()
                    .ifPresent(prev -> {
                        // Unset the old breaking news article if it's not the current one
                        if (!prev.getId().equals(id)) {
                            prev.setBreaking(false);
                            log.debug("un-flagging article: " + prev.getBreaking() + "state");
                            articleRepository.save(prev);
                        }
                    });
        }

        // Set the isBreaking flag for the current article based on the DTO
        existing.setBreaking(Boolean.TRUE.equals(dto.getIsBreaking()));

        articleMapper.updateArticleFromDto(dto, existing);
        existing.setSlug(newSlug);

        // Process social media links
        processSocialMediaLinks(existing, dto);

        // delete the old image if a new one is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if (existing.getFeaturedImage() != null) {
                    deleteArticleImage(existing.getFeaturedImage());
                }
            } catch (Exception e) {
                throw new RuntimeException("An error occurred during the deletion of the old article image : " + e);
            }
            try {
                String newImageFilename = uploadArticleImage(imageFile, newSlug);
                existing.setFeaturedImage(newImageFilename);
                log.error("Image uploaded successfully: {}", existing.getFeaturedImage());
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload new article image : " + e.getMessage(), e);
            }
        }

        Article updated = articleRepository.save(existing);
        log.info("Article updated successfully with image : {}", updated.getFeaturedImage());
        return articleMapper.toDto(updated);
    }

    private void processSocialMediaLinks(Article article, ArticleRequestDto dto) {
        if (dto.getSocialMediaLinks() != null) {
            if (article.getSocialMediaLinks() == null) {
                article.setSocialMediaLinks(new ArrayList<>());
            }
            article.getSocialMediaLinks().clear();
            dto.getSocialMediaLinks().forEach(socialMediaLinkRequestDto -> {
                article.getSocialMediaLinks().add(socialMediaLinkMapper.toEntity(socialMediaLinkRequestDto));
            });
            article.getSocialMediaLinks().forEach(link -> link.setArticle(article));
        }
    }

    // update only the article image
    public ArticleResponseDto updateArticleImage(Long articleId, MultipartFile imageFile) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("No article found with this id : " + articleId));
        // delete the old image
        if (article.getFeaturedImage() != null) {
            try {
                deleteArticleImage(article.getFeaturedImage());
            } catch (Exception e) {
                throw new RuntimeException("An error occurred when deleting the old article image : " + e);
            }
        }
        // upload the new image
        try {
            String newImageFilename = uploadArticleImage(imageFile, article.getSlug());
            article.setFeaturedImage(newImageFilename);
            Article updated = articleRepository.save(article);
            return articleMapper.toDto(updated);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred when uploading the new article image : " + e);
        }
    }

    // delete only the article image
    public void deleteArticleImage(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found with id  : " + articleId));
        if (article.getFeaturedImage() == null) {
            throw new RuntimeException("Article has no featured to delete ");
        }
        try {
            deleteArticleImage(article.getFeaturedImage());
            article.setFeaturedImage(null);
            articleRepository.save(article);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete the article image : " + e);
        }

    }

    // getting the article image information
    public Map<String, Object> getArticleImageInfo(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found with id " + articleId));
        if (article.getFeaturedImage() == null) {
            throw new RuntimeException("Article has no featured image");
        }
        try {
            var fileInfo = minioService.getFileInfo(article.getFeaturedImage());
            Map<String, Object> response = new HashMap<>();
            response.put("articleId", articleId);
            response.put("filename", article.getFeaturedImage());
            response.put("size", fileInfo.size());
            response.put("contentType", fileInfo.contentType());
            response.put("lastModified", fileInfo.lastModified());
            response.put("etag", fileInfo.etag());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get image file information : " + e);
        }

    }

    private Integer calculateReadingTime(String content) {
        if (content == null || content.trim().isEmpty()) {
            return 1; // Default minimum reading time
        }
        // Average reading speed: 200 words per minute
        int wordCount = content.trim().split("\\s+").length;
        int readingTime = Math.max(1, (int) Math.ceil(wordCount / 200.0));
        return readingTime;
    }

    // switching the isActive variable
    public ArticleResponseDto toggleActiveStatus(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // If we are deactivating a breaking article
        if (article.getIsActive() && article.getBreaking()) {
            assignNewBreakingArticle(id);
            article.setBreaking(false); // It's no longer the breaking article
        }

        article.setIsActive(!article.getIsActive());
        Article saved = articleRepository.save(article);
        log.info("Toggled active status for article ID: {} to {}", id, saved.getIsActive());
        return articleMapper.toDto(saved);
    }
    public ArticleResponseDto toggleStatus(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // If we are deactivating a breaking article
        if (article.getStatus().equals(ArticleStatus.InProgress)) {

            article.setStatus(ArticleStatus.Accepted);
        }else if (ArticleStatus.Accepted.equals(article.getStatus())) {
            log.info("The article is already verified u cannot switch the state");
        }
        article.setIsActive(true);

        Article saved = articleRepository.save(article);
        log.info("Toggled active status for article ID: {} to {}", id, saved.getIsActive());
        return articleMapper.toDto(saved);
    }

    private void assignNewBreakingArticle(Long excludedArticleId) {
        log.info("Transferring breaking news status from article ID: {}", excludedArticleId);
        // Find the most recent active article that is not the one being excluded
        Pageable pageable = PageRequest.of(0, 1);
        Page<Article> articlePage = articleRepository.findByIdNotAndIsActiveTrueOrderByPublishedAtDesc(excludedArticleId, pageable);

        if (!articlePage.isEmpty()) {
            Article newBreaking = articlePage.getContent().get(0);
            newBreaking.setBreaking(true);
            articleRepository.save(newBreaking);
            log.info("Assigned breaking news status to new article ID: {}", newBreaking.getId());
        } else {
            log.warn("No other active articles found to transfer breaking news status.");
            // If no other active article is found, the breaking news status is simply removed from the system for now.
        }
    }

}