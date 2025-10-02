package ma.jamcha.jamcha.mappers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.jamcha.jamcha.dtos.dtoRequest.CategoryRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.CategoryResponseDto;
import ma.jamcha.jamcha.entities.Category;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class CategoryMapper {

    @Autowired
    protected ObjectMapper objectMapper;

    /**
     * Maps Category entity to CategoryResponseDto
     */
    @Mapping(target = "translations", source = "translations", qualifiedByName = "stringToJsonString")
    public abstract CategoryResponseDto toDto(Category category);

    /**
     * Maps CategoryRequestDto to Category entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "articles", ignore = true)
    @Mapping(target = "translations", source = "translations", qualifiedByName = "jsonStringToString")
    public abstract Category toEntity(CategoryRequestDto dto);

    /**
     * Updates existing Category entity from CategoryRequestDto
     * Only non-null values from DTO will be mapped
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "articles", ignore = true)
    @Mapping(target = "translations", source = "translations", qualifiedByName = "jsonStringToString")
    public abstract void updateCategoryFromDto(CategoryRequestDto dto, @MappingTarget Category category);

    /**
     * Converts JSON string from entity to formatted JSON string for response
     */
    @Named("stringToJsonString")
    protected String stringToJsonString(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return "{}";
        }

        try {
            // Parse and re-serialize to ensure proper JSON formatting
            Object jsonObject = objectMapper.readValue(jsonString, Object.class);
            return objectMapper.writeValueAsString(jsonObject);
        } catch (JsonProcessingException e) {
            // Return original string if it's not valid JSON
            return jsonString.trim().isEmpty() ? "{}" : jsonString;
        }
    }

    /**
     * Converts JSON string from DTO to string for entity storage
     */
    @Named("jsonStringToString")
    protected String jsonStringToString(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return "{}";
        }

        try {
            // Validate JSON and minify if needed
            Object jsonObject = objectMapper.readValue(jsonString, Object.class);
            return objectMapper.writeValueAsString(jsonObject);
        } catch (JsonProcessingException e) {
            // Return empty JSON object if invalid JSON is provided
            return "{}";
        }
    }

    /**
     * Additional helper method for JSON validation
     */
    protected boolean isValidJson(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return false;
        }

        try {
            objectMapper.readTree(jsonString);
            return true;
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}