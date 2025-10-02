package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.entities.*;
import ma.jamcha.jamcha.repositories.*;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MapperUtil {

    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final AuthorRepository authorRepository; // Add this

    public MapperUtil(
            CategoryRepository categoryRepository,
            TagRepository tagRepository,
            UserRepository userRepository,
            ArticleRepository articleRepository,
            CommentRepository commentRepository,
            AuthorRepository authorRepository // Add this parameter
    ) {
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.commentRepository = commentRepository;

        this.authorRepository = authorRepository; // Add this assignment

    }

    // 🔹 Category lookup
    @Named("categoryIdToCategory")
    public Category categoryIdToCategory(Long id) {
        if (id == null) return null;
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // 🔹 Tag lookup
    @Named("tagIdsToTags")
    public List<Tag> tagIdsToTags(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();

        Set<Long> idSet = ids.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (idSet.isEmpty()) return List.of();

        List<Tag> tags = tagRepository.findAllById(idSet);
        if (tags.size() != idSet.size()) {
            Set<Long> foundIds = tags.stream().map(Tag::getId).collect(Collectors.toSet());
            idSet.removeAll(foundIds);
            throw new RuntimeException("Tags not found with IDs: " + idSet);
        }
        return tags;
    }

    // 🔹 User lookup
    @Named("userIdToUser")
    public User userIdToUser(Long id) {
        if (id == null) return null;
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Named("authorIdToAuthor")
    public Author authorIdToAuthor(Long id) {
        if (id == null) return null;
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
    }

    // 🔹 Article lookup
    @Named("articleIdToArticle")
    public Article articleIdToArticle(Long id) {
        if (id == null) return null;
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
    }

    // 🔹 Comment lookup
    @Named("commentIdToComment")
    public Comment commentIdToComment(Long id) {
        if (id == null) return null;
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }
}