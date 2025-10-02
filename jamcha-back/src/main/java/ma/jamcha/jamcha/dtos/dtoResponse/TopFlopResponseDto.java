// TopFlopResponseDto
package ma.jamcha.jamcha.dtos.dtoResponse;

import lombok.Builder;
import lombok.Value;
import ma.jamcha.jamcha.entities.TopFlopEntry;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Value
@Builder(builderMethodName = "newBuilder")
public class TopFlopResponseDto {
    Long id;
    String personName;
    String slug;
    String description;
    String reason;
    Integer position;
    String profileImage;
    TopFlopEntry.EntryType entryType;
    CategoryResponseDto category;
    AuthorResponseDto author;
    LocalDate weekOf;
    Integer voteCount;
    String language;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
