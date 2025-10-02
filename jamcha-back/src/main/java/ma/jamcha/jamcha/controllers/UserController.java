package ma.jamcha.jamcha.controllers;

import lombok.RequiredArgsConstructor;
import ma.jamcha.jamcha.dtos.dtoRequest.PasswordChangeRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserRequestDto;
import ma.jamcha.jamcha.dtos.dtoRequest.UserUpdateRequestDto;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;
import ma.jamcha.jamcha.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User", description = "User management APIs")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody UserRequestDto dto) {
        UserResponseDto created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDto dto) {
        UserResponseDto updated = userService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{username}")
    public ResponseEntity<UserResponseDto> partialUpdate(
            @PathVariable String username,
            @Valid @RequestBody UserUpdateRequestDto dto) {
        UserResponseDto updated = userService.partialUpdateWithReflection(username, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // endpoint only for password changes
    @PatchMapping("/{username}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable String username,
            @Valid @RequestBody PasswordChangeRequestDto dto) {
        userService.changePassword(username, dto);
        return ResponseEntity.noContent().build();
    }
}