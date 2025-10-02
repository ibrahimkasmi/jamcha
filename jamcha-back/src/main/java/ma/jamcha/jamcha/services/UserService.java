package ma.jamcha.jamcha.services;

import ma.jamcha.jamcha.dtos.dtoRequest.PasswordChangeRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserUpdateRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;

import java.util.List;

public interface UserService {
    List<UserResponseDto> getAll();
    UserResponseDto getById(Long id);
    UserResponseDto create(UserRequestDto dto);
    UserResponseDto update(Long id, UserRequestDto dto);
    void delete(Long id);
    UserResponseDto partialUpdateWithReflection(String username, UserUpdateRequestDto dto);
    void changePassword(String username, PasswordChangeRequestDto dto);

}