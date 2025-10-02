package ma.jamcha.jamcha.utils;

import ma.jamcha.jamcha.enums.UserRole;
import ma.jamcha.jamcha.dtos.dtoResponse.UserResponseDto;
import ma.jamcha.jamcha.security.UserInfo;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.HashSet;
import java.util.Map;
import java.util.List;
import java.util.Set;

public class JwtUtils {

    public static UserResponseDto extractUser(Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("firstName");
        String lastName = jwt.getClaimAsString("lastName");
        String provider = jwt.getClaimAsString("provider");
        String providerId = jwt.getClaimAsString("providerId");

        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        String role = UserRole.AUTHOR.getValue(); // Default

        if (realmAccess != null && realmAccess.get("roles") instanceof List) {
            List<String> roles = (List<String>) realmAccess.get("roles");
            if (roles.contains(UserRole.ADMIN.getValue())) {
                role = UserRole.ADMIN.getValue();
            } else if (roles.contains(UserRole.AUTHOR.getValue())) {
                role = UserRole.AUTHOR.getValue();
            }
        }

        return UserResponseDto.builder()
            .username(username)
            .email(email)
            .firstName(firstName)
            .lastName(lastName)
            .role(role)
            .provider(provider)
            .providerId(providerId)
            .build();
    }
    public static UserInfo extractUserInfo(Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");

        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        Set<String> roles = Set.of();

        if (realmAccess != null && realmAccess.get("roles") instanceof List) {
            roles = new HashSet<>((List<String>) realmAccess.get("roles"));
        }

        return new UserInfo(username, roles);
    }

}
