// TopFlopService Interface
package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoRequest.TopFlopRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.TopFlopResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TopFlopService {
    List<TopFlopResponseDto> getCurrentWeekEntries(String language);
    List<TopFlopResponseDto> getEntriesByWeek(LocalDate weekOf, String language);
    TopFlopResponseDto getById(Long id);
    TopFlopResponseDto findBySlug(String slug);
    TopFlopResponseDto create(TopFlopRequestDto dto);
    TopFlopResponseDto createWithImage(TopFlopRequestDto dto, MultipartFile imageFile);
    TopFlopResponseDto update(Long id, TopFlopRequestDto dto);
    TopFlopResponseDto updateWithImage(Long id, TopFlopRequestDto dto, MultipartFile imageFile);
    void delete(Long id);
    Map<String, Object> getProfileImageInfo(Long entryId);
    TopFlopResponseDto updateProfileImage(Long entryId, MultipartFile imageFile);
    void deleteProfileImage(Long entryId);
}