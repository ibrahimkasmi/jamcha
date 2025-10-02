// TopFlopRequestDto
package ma.jamcha.jamcha.dtos.dtoRequest;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import ma.jamcha.jamcha.entities.TopFlopEntry;

import java.time.LocalDate;

@Data
@Builder
public class TopFlopRequestDto {
    @NotBlank(message = "Person name is required")
    private String personName;

    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Reason is required")
    private String reason;

    @Min(value = 1, message = "Position must be at least 1")
    @Max(value = 10, message = "Position cannot exceed 10")
    private Integer position;

    private String profileImage;

    @NotNull(message = "Entry type is required")
    private TopFlopEntry.EntryType entryType;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    @NotNull(message = "Week date is required")
    private LocalDate weekOf;

    private String language;
}