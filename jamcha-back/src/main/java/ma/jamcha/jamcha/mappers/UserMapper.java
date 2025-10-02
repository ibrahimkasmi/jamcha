package ma.jamcha.jamcha.mappers;

import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;
import ma.jamcha.jamcha.entities.User;
import ma.jamcha.jamcha.entities.Author;
import ma.jamcha.jamcha.enums.UserRole;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Use custom mapping method to handle inheritance properly
    default UserResponseDto toDto(User user) {
        if (user instanceof Author) {
            Author author = (Author) user;
            return UserResponseDto.builder()
                    .id(author.getId())
                    .username(author.getUsername())
                    .email(author.getEmail())
                    .firstName(author.getFirstName())
                    .lastName(author.getLastName())
                    .role(author.getRole() != null ? author.getRole().name() : null)
                    .provider(author.getProvider())
                    .providerId(author.getProviderId())
                    .authorName(author.getName())
                    .avatar(author.getAvatar())
                    .createdAt(author.getCreatedAt())
                    .build();
        } else {
            return UserResponseDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole() != null ? user.getRole().name() : null)
                    .provider(user.getProvider())
                    .providerId(user.getProviderId())
                    .authorName(null)
                    .avatar(null)
                    .createdAt(user.getCreatedAt())
                    .build();
        }
    }

    // For regular User entities
    @Mapping(target = "role", expression = "java(dto.getRole() != null ? ma.jamcha.jamcha.enums.UserRole.valueOf(dto.getRole()) : ma.jamcha.jamcha.enums.UserRole.AUTHOR)")
    User toEntity(UserRequestDto dto);

    void updateUserFromDto(UserRequestDto dto, @MappingTarget User user);
}