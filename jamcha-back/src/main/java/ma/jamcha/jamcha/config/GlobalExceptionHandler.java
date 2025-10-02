package ma.jamcha.jamcha.config;

import ma.jamcha.jamcha.dtos.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .findFirst()
            .orElse("Validation error");
        return ResponseEntity.badRequest().body(AuthResponse.builder()
            .success(false)
            .message(errorMsg)
            .build());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<AuthResponse> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(AuthResponse.builder()
            .success(false)
            .message(ex.getMessage())
            .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleException(Exception ex) {
        return ResponseEntity.status(500).body(AuthResponse.builder()
            .success(false)
            .message("Internal server error: " + ex.getMessage())
            .build());
    }
}
