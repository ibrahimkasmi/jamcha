package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.jamcha.jamcha.dtos.dtoRequest.ArticleRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.ArticleResponseDto;
import ma.jamcha.jamcha.security.UserInfo;
import ma.jamcha.jamcha.services.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.tags.Tag;


import java.util.List;
import java.util.Map;


import static ma.jamcha.jamcha.utils.JwtUtils.extractUserInfo;

@Tag(name = "Article", description = "Article management APIs")
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ArticleController {

    private final ArticleService articleService;
    @GetMapping
    public ResponseEntity<List<ArticleResponseDto>> getAll(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String category
    ) {
        log.info("Fetching articles with pagination - Page: {}, Limit: {}", page, limit);
        List<ArticleResponseDto> articles = articleService.getByLanguageAndCategory(language, limit, page, category);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/my-articles")
    public ResponseEntity<List<ArticleResponseDto>> getMyArticles(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String category,
            JwtAuthenticationToken token
    ) {
        log.info("Fetching articles for authenticated user with language: {}, limit: {}, page: {}, category: {}",
                language, limit, page, category);

        UserInfo userInfo = extractUserInfo(token.getToken());
        log.info("Fetching articles for user role: {}", userInfo.roles());
        List<ArticleResponseDto> articles = articleService.fetchArticlesBasedOnRole(
                userInfo, language, limit, page, category
        );

        log.info("Retrieved {} articles for user: {}", articles.size(), userInfo.username());
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ArticleResponseDto>> getFeaturedArticles(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "1") int limit,
            @RequestParam(defaultValue = "0") int page) {
        List<ArticleResponseDto> articles = articleService.getFeaturedByLanguage(language, limit, page);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ArticleResponseDto>> getLatestArticles(
            @RequestParam(defaultValue = "ar") String language,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(defaultValue = "0") int page) {
        List<ArticleResponseDto> articles = articleService.getLatestByLanguage(language, limit, page);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ArticleResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getById(id));
    }

    //updating the creation of the article to handle the image upload
    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleResponseDto> createArticleWithImage(
            @RequestPart("article") ArticleRequestDto dto,
            @RequestPart("image") MultipartFile imageFile) {

        log.info("=== CONTROLLER REACHED ===");
        log.info("About to call service...");

        // Add try-catch to see if service call hangs
        try {
            ArticleResponseDto created = articleService.createWithImage(dto, imageFile);
            log.info("Service call completed successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Service call failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        log.info("TEST ENDPOINT HIT!");
        return ResponseEntity.ok("Test successful");
    }

    // updating the update of the article to handle image update
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleResponseDto> updateArticleWithImage(
            @PathVariable Long id,
            @RequestPart("article") ArticleRequestDto dto,
            @RequestPart("image") MultipartFile imageFile) {
        return ResponseEntity.ok(articleService.updateWithImage(id, dto, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteArticleImage(@PathVariable Long id) {
        articleService.deleteArticleImage(id);
        return ResponseEntity.noContent().build();
    }


    // getting the image information
    @GetMapping("/{id}/image/info")
    public ResponseEntity<Map<String, Object>> getArticleImageInfo(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleImageInfo(id));
    }

    //update the article image
    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleResponseDto> updateArticleImage(
            @PathVariable Long id,
            @RequestPart("image") MultipartFile imageFile) {
        return ResponseEntity.ok(articleService.updateArticleImage(id, imageFile));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ArticleResponseDto> getArticleBySlug(@PathVariable String slug) {
        ArticleResponseDto article = articleService.findBySlug(slug);
        return ResponseEntity.ok(article);
    }
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ArticleResponseDto> toggleActiveStatus(@PathVariable Long id) {
        log.info("Toggling active status for article with ID: {}", id);
        ArticleResponseDto updatedArticle = articleService.toggleActiveStatus(id);
        return ResponseEntity.ok(updatedArticle);
    }
    @PatchMapping("/{id}/edit-status")
    public ResponseEntity<ArticleResponseDto> toggleStatus (@PathVariable Long id) {
        log.info("Toggling active status for article with ID: {}", id);
        ArticleResponseDto updatedArticle = articleService.toggleStatus(id);
        return ResponseEntity.ok(updatedArticle);
    }



}