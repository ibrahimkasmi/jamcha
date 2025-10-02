package ma.jamcha.jamcha.dtos;

public record ErrorResponse(String message, String timestamp, String error) {
    public ErrorResponse(String message) {
        this(message, java.time.Instant.now().toString(), "CONSTRAINT_VIOLATION");
    }

    public ErrorResponse(String message, String error) {
        this(message, java.time.Instant.now().toString(), error);
    }
}
