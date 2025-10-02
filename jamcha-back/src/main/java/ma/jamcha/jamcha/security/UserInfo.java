package ma.jamcha.jamcha.security;

import java.util.Set;

public record UserInfo(String username, Set<String> roles) {
    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    public boolean isAdmin() {
        return roles.contains("ADMIN");
    }

    public boolean isAuthor() {
        return roles.contains("AUTHOR");
    }
}
