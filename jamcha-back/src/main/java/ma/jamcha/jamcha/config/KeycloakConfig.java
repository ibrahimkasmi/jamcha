package ma.jamcha.jamcha.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KeycloakConfig {

    private final KeycloakProperties keycloakProperties;

    public String getTokenUrl() {
        return keycloakProperties.getServerUrl() + "/realms/" + keycloakProperties.getRealm()
                + "/protocol/openid-connect/token";
    }

    public String getAdminTokenUrl() {
        return keycloakProperties.getServerUrl() + "/realms/" + keycloakProperties.getAdminRealm()
                + "/protocol/openid-connect/token";
    }

    public String getUsersUrl() {
        return keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm() + "/users";
    }

    public String getClientId() {
        return keycloakProperties.getClientId();
    }

    public String getClientSecret() {
        return keycloakProperties.getClientSecret();
    }

    public String getAdminUsername() {
        return keycloakProperties.getAdminUsername();
    }

    public String getAdminPassword() {
        return keycloakProperties.getAdminPassword();
    }

    public String getRealm() {
        return keycloakProperties.getRealm();
    }

    public String getServerUrl() {
        return keycloakProperties.getServerUrl();
    }

    public String getRolesUrl() {
        return keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm() + "/roles";
    }

    public String getUserRoleMappingsUrl(String userId) {
        return keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm()
               + "/users/" + userId + "/role-mappings/realm";
    }

    public String getGroupsUrl() {
        return keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm() + "/groups";
    }

    public String getUserGroupsUrl(String userId) {
        return keycloakProperties.getServerUrl() + "/admin/realms/" + keycloakProperties.getRealm()
               + "/users/" + userId + "/groups";
    }

    public String getRole() {
        return keycloakProperties.getRole();
    }

    public void setRole(String role) {
        keycloakProperties.setRole(role);
    }
}
