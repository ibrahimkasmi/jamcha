package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.ArticleRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.*;
import ma.jamcha.jamcha.entities.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class, SocialMediaLinkMapper.class}
)
public interface ArticleMapper {

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "tags", source = "tagIds", qualifiedByName = "tagIdsToTags")
    @Mapping(target = "breaking", source = "isBreaking")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "socialMediaLinks", source = "socialMediaLinks")
    Article toEntity(ArticleRequestDto dto);

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "tags", source = "tagIds", qualifiedByName = "tagIdsToTags")
    @Mapping(target = "breaking", source = "isBreaking")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "socialMediaLinks", source = "socialMediaLinks")
    void updateArticleFromDto(ArticleRequestDto dto, @MappingTarget Article article);

    @Mapping(target = "isBreaking", source = "breaking")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "comments", ignore = true)
    ArticleResponseDto toDto(Article article);


    @AfterMapping
    default void enrichDto(Article article, @MappingTarget ArticleResponseDto.ArticleResponseDtoBuilder dto) {
        if (article.getCategory() != null) {
            dto.category(categoryToDto(article.getCategory()));
        }
        if (article.getTags() != null && !article.getTags().isEmpty()) {
            dto.tags(tagsToDtos(article.getTags()));
        }
        if (article.getAuthor() != null) {
            dto.author(authorToDto(article.getAuthor()));
        }
        if (article.getSocialMediaLinks() != null && !article.getSocialMediaLinks().isEmpty()) {
            dto.socialMediaLinkResponseDtos(socialMediaLinksToDtos(article.getSocialMediaLinks()));
        }
        if (article.getStatus() != null) {
            dto.status(article.getStatus().name());
        }
    }

    @Named("categoryToDto")
    CategoryResponseDto categoryToDto(Category category);

    @Named("tagToDto")
    TagResponseDto tagToDto(Tag tag);

    @IterableMapping(qualifiedByName = "tagToDto")
    List<TagResponseDto> tagsToDtos(List<Tag> tags);

    AuthorResponseDto authorToDto(Author author);

    @Named("socialMediaLinkToDto")
    SocialMediaLinkResponseDto socialMediaLinkToDto(SocialMediaLink socialMediaLink);

    @IterableMapping(qualifiedByName = "socialMediaLinkToDto")
    List<SocialMediaLinkResponseDto> socialMediaLinksToDtos(List<SocialMediaLink> socialMediaLinks);


    @ObjectFactory
    default ArticleResponseDto.ArticleResponseDtoBuilder articleResponseDtoBuilder() {
        return ArticleResponseDto.newBuilder();
    }
}