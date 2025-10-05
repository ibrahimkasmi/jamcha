package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoResponse.ArticleResponseDto;
import ma.jamcha.jamcha.dtos.dtoRequest.ArticleRequestDto;
import ma.jamcha.jamcha.security.UserInfo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ArticleService {

    List<ArticleResponseDto> getAll();

    ArticleResponseDto getById(Long id);

    ArticleResponseDto create(ArticleRequestDto dto);

    ArticleResponseDto update(Long id, ArticleRequestDto dto);

    //create the article with the imageFile
    ArticleResponseDto createWithImage(ArticleRequestDto dto , MultipartFile imageFile);
    //update the image with the image file
    ArticleResponseDto updateWithImage(Long id ,ArticleRequestDto dto ,MultipartFile imageFile);
    // update just the article image
    ArticleResponseDto updateArticleImage(Long articleId,MultipartFile imageFile);
    //delete the article image
    void deleteArticleImage(Long articleId);
    //get the article image info
    Map<String ,Object> getArticleImageInfo(Long articleId);
    // delete the entire article
    void delete(Long id);
    // ArticleService.java
    ArticleResponseDto findBySlug(String slug);

    // ========== UPDATED METHODS WITH PAGINATION ==========

    // Keep old method for backward compatibility
    List<ArticleResponseDto> getByLanguage(String language, int limit);

    // Add new method with page parameter
    List<ArticleResponseDto> getByLanguage(String language, int limit, int page);


    // Add paginated version
    List<ArticleResponseDto> getFeaturedByLanguage(String language, int limit, int page);

    // Keep old method for backward compatibility
    List<ArticleResponseDto> getByLanguageAndCategory(String language, int limit, String category);

    // Add new method with page parameter
    List<ArticleResponseDto> getByLanguageAndCategory(String language, int limit, int page, String category);

    List<ArticleResponseDto> searchByTitleOrContent(String query, String language);

    // Keep old method for backward compatibility
    List<ArticleResponseDto> getLatestByLanguage(String language, int limit);

    // Add new method with page parameter
    List<ArticleResponseDto> getLatestByLanguage(String language, int limit, int page);

    // Keep old methods for backward compatibility
    List<ArticleResponseDto> getByAuthorAndFilters(String username, String language, int limit, String category);
    List<ArticleResponseDto> getAllWithFilters(String language, int limit, String category);

    // Add new methods with page parameter
    List<ArticleResponseDto> getByAuthorAndFilters(String username, String language, int limit, int page, String category);
    List<ArticleResponseDto> getAllWithFilters(String language, int limit, int page, String category);
    List<ArticleResponseDto> fetchArticlesBasedOnRole(
            UserInfo userInfo, String language, int limit, int page, String category);

    ArticleResponseDto toggleActiveStatus(Long id);
    ArticleResponseDto toggleStatus(Long id);}