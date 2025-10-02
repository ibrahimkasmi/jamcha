// PodcastMapper
package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.PodcastRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.PodcastResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.PodcastCommentResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.AuthorResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TagResponseDto;
import ma.jamcha.jamcha.entities.Podcast;
import ma.jamcha.jamcha.entities.PodcastComment;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.entities.Category;
import ma.jamcha.jamcha.entities.Tag;
import org.mapstruct.*;
import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class, AuthorMapper.class, CategoryMapper.class, TagMapper.class}
)
public interface PodcastMapper {

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "tags", source = "tagIds", qualifiedByName = "tagIdsToTags")
    @Mapping(target = "featured", source = "isFeatured")
    @Mapping(target = "author", source = "authorId", qualifiedByName = "authorIdToAuthor")
    @Mapping(target = "viewCount", constant = "0L")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Podcast toEntity(PodcastRequestDto dto);

    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "tags", source = "tagIds", qualifiedByName = "tagIdsToTags")
    @Mapping(target = "featured", source = "isFeatured")
    @Mapping(target = "author", source = "authorId", qualifiedByName = "authorIdToAuthor")

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updatePodcastFromDto(PodcastRequestDto dto, @MappingTarget Podcast podcast);

    @Mapping(target = "isFeatured", source = "featured")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "author", ignore = true)
    PodcastResponseDto toDto(Podcast podcast);

    @AfterMapping
    default void enrichDto(Podcast podcast, @MappingTarget PodcastResponseDto.PodcastResponseDtoBuilder dto) {
        if (podcast.getCategory() != null) {
            dto.category(categoryToDto(podcast.getCategory()));
        }
        if (podcast.getTags() != null && !podcast.getTags().isEmpty()) {
            dto.tags(tagsToDtos(podcast.getTags()));
        }
        if (podcast.getAuthor() != null) {
            dto.author(authorToDto(podcast.getAuthor()));
        }
        if (podcast.getComments() != null && !podcast.getComments().isEmpty()) {
            dto.comments(commentsToDtos(podcast.getComments()));
        }
    }

    @Named("categoryToDto")
    CategoryResponseDto categoryToDto(Category category);

    @Named("tagToDto")
    TagResponseDto tagToDto(Tag tag);

    @IterableMapping(qualifiedByName = "tagToDto")
    List<TagResponseDto> tagsToDtos(List<Tag> tags);

    AuthorResponseDto authorToDto(Author author);

    @Named("commentToDto")
    PodcastCommentResponseDto commentToDto(PodcastComment comment);

    @IterableMapping(qualifiedByName = "commentToDto")
    List<PodcastCommentResponseDto> commentsToDtos(List<PodcastComment> comments);

    @ObjectFactory
    default PodcastResponseDto.PodcastResponseDtoBuilder podcastResponseDtoBuilder() {
        return PodcastResponseDto.newBuilder();
    }

    @ObjectFactory
    default PodcastCommentResponseDto.PodcastCommentResponseDtoBuilder podcastCommentResponseDtoBuilder() {
        return PodcastCommentResponseDto.newBuilder();
    }
}