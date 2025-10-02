package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoResponse.ArticleResponseDto;
import ma.jamcha.jamcha.services.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Search", description = "Search management APIs")
@RestController
@RequiredArgsConstructor
public class SearchController {

    private final ArticleService articleService;

    @GetMapping("/api/search")
    public ResponseEntity<List<ArticleResponseDto>> searchArticles(
            @RequestParam String q,
            @RequestParam(defaultValue = "ar") String language) {

        List<ArticleResponseDto> results = articleService.searchByTitleOrContent(q, language);
        return ResponseEntity.ok(results);
    }
}