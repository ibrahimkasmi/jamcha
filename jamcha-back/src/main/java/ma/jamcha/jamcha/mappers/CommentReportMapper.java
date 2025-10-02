package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.CommentReportRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentReportResponseDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CommentResponseDto;
import ma.jamcha.jamcha.entities.Comment;
import ma.jamcha.jamcha.entities.CommentReport;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MapperUtil.class}
)
public interface CommentReportMapper {

    @Mapping(target = "comment", source = "commentId", qualifiedByName = "commentIdToComment")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reportedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "reviewedAt", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    CommentReport toEntity(CommentReportRequestDto dto);

    CommentReportResponseDto toDto(CommentReport report);

    @Mapping(target = "comment", ignore = true)
    @Mapping(target = "reportedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "reviewedAt", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    void updateCommentReportFromDto(CommentReportRequestDto dto, @MappingTarget CommentReport report);

    @AfterMapping
    default void enrichDto(CommentReport report, @MappingTarget CommentReportResponseDto.CommentReportResponseDtoBuilder dto) {
        if (report.getComment() != null) {
            dto.comment(commentToDto(report.getComment()));
        }
    }

    CommentResponseDto commentToDto(Comment comment);

    @ObjectFactory
    default CommentReportResponseDto.CommentReportResponseDtoBuilder commentReportResponseDtoBuilder() {
        return CommentReportResponseDto.newBuilder();
    }
}
