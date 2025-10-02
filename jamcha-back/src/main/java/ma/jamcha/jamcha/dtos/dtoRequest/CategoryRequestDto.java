package ma.jamcha.jamcha.dtos.dtoRequest;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.*;

@Data
@Builder
public class CategoryRequestDto {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String color;
    private String icon;
    private String translations;
}