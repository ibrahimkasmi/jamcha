package ma.jamcha.jamcha.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.jamcha.jamcha.config.KeycloakConfig;
import ma.jamcha.jamcha.entities.User;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakUserService {

    private final KeycloakConfig keycloakConfig;
    private final RestTemplate restTemplate;

    /**
     * Create user in Keycloak and return the Keycloak user ID
     */
    public String createUserInKeycloak(User user, String plainPassword)
        throws Exception {
        try {
            log.info("Creating user in Keycloak: {}", user.getUsername());

            // Get admin token
            String adminToken = getAdminToken();

            // Prepare user data for Keycloak
            Map<String, Object> keycloakUser = new HashMap<>();
            keycloakUser.put("username", user.getUsername());
            keycloakUser.put("email", user.getEmail());
            keycloakUser.put(
                "firstName",
                user.getFirstName() != null ? user.getFirstName() : ""
            );
            keycloakUser.put(
                "lastName",
                user.getLastName() != null ? user.getLastName() : ""
            );
            keycloakUser.put("enabled", true);
            keycloakUser.put("emailVerified", true);

            // Set password with proper settings to prevent temporary lock
            Map<String, Object> credential = new HashMap<>();
            credential.put("type", "password");
            credential.put("value", plainPassword);
            credential.put("temporary", false);
            credential.put(
                "credentialData",
                "{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\"}"
            );
            credential.put(
                "secretData",
                "{\"value\":\"" + plainPassword + "\",\"salt\":\"\"}"
            );
            keycloakUser.put("credentials", List.of(credential));

            // Additional settings to ensure user is not locked
            keycloakUser.put("requiredActions", List.of());
            keycloakUser.put("notBefore", 0);

            // Create user in Keycloak (without role - we'll assign role separately)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                keycloakUser,
                headers
            );

            ResponseEntity<String> response = restTemplate.postForEntity(
                keycloakConfig.getUsersUrl(),
                request,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                // Extract user ID from Location header
                String locationHeader = response
                    .getHeaders()
                    .getFirst("Location");
                if (locationHeader != null) {
                    String keycloakUserId = locationHeader.substring(
                        locationHeader.lastIndexOf('/') + 1
                    );
                    //                    log.("User created successfully in Keycloak with ID: {}", keycloakUserId);

                    // Now assign the role to the user
                    assignRoleToUser(keycloakUserId, user.getRole().name());

                    // Assign user to the appropriate group
                    assignUserToGroup(keycloakUserId, user.getRole().name());

                    return keycloakUserId;
                } else {
                    throw new RuntimeException(
                        "Could not extract Keycloak user ID from response"
                    );
                }
            } else {
                throw new RuntimeException(
                    "Failed to create user in Keycloak: " +
                        response.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error("Failed to create user in Keycloak", e);
            throw new RuntimeException(
                "Keycloak user creation failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Update user information in Keycloak
     * @param updatedUser The user entity with updated information
     * @throws Exception if the update fails
     */
    public void updateUserInKeycloak(User updatedUser) throws Exception {
        try {
            log.info(
                "Updating user in Keycloak: {} with ID: {}",
                updatedUser.getUsername(),
                updatedUser.getKeycloakId()
            );

            // Get admin token
            String adminToken = getAdminToken();

            // Prepare updated user data for Keycloak
            Map<String, Object> keycloakUserUpdate = new HashMap<>();
            keycloakUserUpdate.put("username", updatedUser.getUsername());
            keycloakUserUpdate.put("email", updatedUser.getEmail());
            keycloakUserUpdate.put(
                "firstName",
                updatedUser.getFirstName() != null
                    ? updatedUser.getFirstName()
                    : ""
            );
            keycloakUserUpdate.put(
                "lastName",
                updatedUser.getLastName() != null
                    ? updatedUser.getLastName()
                    : ""
            );
            keycloakUserUpdate.put(
                "enabled",
                updatedUser.getIsActive() != null
                    ? updatedUser.getIsActive()
                    : true
            );
            keycloakUserUpdate.put("emailVerified", true);

            // Create HTTP headers with admin token
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                keycloakUserUpdate,
                headers
            );

            // Make PUT request to update user in Keycloak
            String updateUrl =
                keycloakConfig.getUsersUrl() +
                "/" +
                updatedUser.getKeycloakId();

            ResponseEntity<Void> response = restTemplate.exchange(
                updateUrl,
                HttpMethod.PUT,
                request,
                Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info(
                    "User {} successfully updated in Keycloak",
                    updatedUser.getUsername()
                );
            } else {
                throw new RuntimeException(
                    "Failed to update user in Keycloak: " +
                        response.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error(
                "Failed to update user {} in Keycloak",
                updatedUser.getUsername(),
                e
            );
            throw new RuntimeException(
                "Keycloak user update failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Get admin token for Keycloak operations
     */
    private String getAdminToken() throws Exception {
        try {
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", "admin-cli");
            body.add("username", keycloakConfig.getAdminUsername());
            body.add("password", keycloakConfig.getAdminPassword());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(body, headers);

            ResponseEntity<Object> response = restTemplate.postForEntity(
                keycloakConfig.getAdminTokenUrl(),
                request,
                Object.class
            );

            if (
                response.getStatusCode().is2xxSuccessful() &&
                response.getBody() != null
            ) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = (Map<
                    String,
                    Object
                >) response.getBody();
                return (String) responseBody.get("access_token");
            } else {
                throw new RuntimeException("Failed to get admin token");
            }
        } catch (Exception e) {
            System.err.println(
                "Failed to get Keycloak admin token: " + e.getMessage()
            );
            throw e;
        }
    }

    /**
     * Update user password in Keycloak
     * @param keycloakUserId The Keycloak user ID
     * @param newPassword The new plain text password
     * @throws Exception if the password update fails
     */
    public void updateUserPasswordInKeycloak(
        String keycloakUserId,
        String newPassword
    ) throws Exception {
        try {
            log.info("Updating password for Keycloak user: {}", keycloakUserId);

            String adminToken = getAdminToken();

            // Prepare password update payload
            Map<String, Object> credential = new HashMap<>();
            credential.put("type", "password");
            credential.put("value", newPassword);
            credential.put("temporary", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                credential,
                headers
            );

            String passwordUpdateUrl =
                keycloakConfig.getUsersUrl() +
                "/" +
                keycloakUserId +
                "/reset-password";

            ResponseEntity<Void> response = restTemplate.exchange(
                passwordUpdateUrl,
                HttpMethod.PUT,
                request,
                Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info(
                    "Password successfully updated for Keycloak user: {}",
                    keycloakUserId
                );
            } else {
                throw new RuntimeException(
                    "Failed to update password in Keycloak: " +
                        response.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error(
                "Failed to update password for Keycloak user: {}",
                keycloakUserId,
                e
            );
            throw new RuntimeException(
                "Keycloak password update failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Update user role in Keycloak
     */
    public void updateUserRoleInKeycloak(String keycloakId, String newRole)
        throws Exception {
        try {
            @SuppressWarnings("unused")
            String adminToken = getAdminToken();

            // Implementation for updating user role in Keycloak
            // This would involve removing old roles and adding new ones
            // For now, we'll log the action
            System.out.println(
                "Updating user role in Keycloak: " +
                    keycloakId +
                    " to " +
                    newRole
            );
        } catch (Exception e) {
            System.err.println(
                "Failed to update user role in Keycloak: " + e.getMessage()
            );
            throw e;
        }
    }

    /**
     * Disable user in Keycloak
     */
    public void disableUserInKeycloak(String keycloakId) throws Exception {
        try {
            @SuppressWarnings("unused")
            String adminToken = getAdminToken();

            // Implementation for disabling user in Keycloak
            System.out.println("Disabling user in Keycloak: " + keycloakId);
        } catch (Exception e) {
            System.err.println(
                "Failed to disable user in Keycloak: " + e.getMessage()
            );
            throw e;
        }
    }

    /**
     * Assign realm role to user in Keycloak
     */
    public void assignRoleToUser(String userId, String roleName)
        throws Exception {
        try {
            log.info(
                "Assigning role {} to user {} in Keycloak",
                roleName,
                userId
            );

            String adminToken = getAdminToken();

            // First, get the role details from Keycloak
            HttpHeaders getHeaders = new HttpHeaders();
            getHeaders.setBearerAuth(adminToken);
            HttpEntity<Void> getRequest = new HttpEntity<>(getHeaders);

            ResponseEntity<Object> roleResponse = restTemplate.exchange(
                keycloakConfig.getRolesUrl() + "/" + roleName,
                HttpMethod.GET,
                getRequest,
                Object.class
            );

            if (
                !roleResponse.getStatusCode().is2xxSuccessful() ||
                roleResponse.getBody() == null
            ) {
                throw new RuntimeException(
                    "Role " + roleName + " not found in Keycloak"
                );
            }

            // Prepare role assignment request
            @SuppressWarnings("unchecked")
            Map<String, Object> roleData = (Map<
                String,
                Object
            >) roleResponse.getBody();
            List<Map<String, Object>> rolesToAssign = List.of(roleData);

            // Assign role to user
            HttpHeaders postHeaders = new HttpHeaders();
            postHeaders.setContentType(MediaType.APPLICATION_JSON);
            postHeaders.setBearerAuth(adminToken);

            HttpEntity<List<Map<String, Object>>> assignRequest =
                new HttpEntity<>(rolesToAssign, postHeaders);

            ResponseEntity<Void> assignResponse = restTemplate.exchange(
                keycloakConfig.getUserRoleMappingsUrl(userId),
                HttpMethod.POST,
                assignRequest,
                Void.class
            );

            if (assignResponse.getStatusCode().is2xxSuccessful()) {
                log.info(
                    "Role {} successfully assigned to user {} in Keycloak",
                    roleName,
                    userId
                );
            } else {
                throw new RuntimeException(
                    "Failed to assign role to user: " +
                        assignResponse.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error(
                "Failed to assign role {} to user {} in Keycloak",
                roleName,
                userId,
                e
            );
            throw new RuntimeException(
                "Role assignment failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Fetch available realm roles from Keycloak
     */
    public List<String> fetchAvailableRoles() throws Exception {
        try {
            log.info("Fetching available roles from Keycloak");

            String adminToken = getAdminToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Object[]> response = restTemplate.exchange(
                keycloakConfig.getRolesUrl(),
                HttpMethod.GET,
                request,
                Object[].class
            );

            if (
                response.getStatusCode().is2xxSuccessful() &&
                response.getBody() != null
            ) {
                List<String> roleNames = new java.util.ArrayList<>();
                for (Object roleObj : response.getBody()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> role = (Map<String, Object>) roleObj;
                    String roleName = (String) role.get("name");

                    // Filter only our application roles (AUTHOR, ADMIN)
                    if ("AUTHOR".equals(roleName) || "ADMIN".equals(roleName)) {
                        roleNames.add(roleName);
                    }
                }

                log.info("Available roles fetched: {}", roleNames);
                return roleNames;
            } else {
                throw new RuntimeException(
                    "Failed to fetch roles from Keycloak"
                );
            }
        } catch (Exception e) {
            log.error("Failed to fetch available roles from Keycloak");
            throw new RuntimeException(
                "Failed to fetch roles: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Delete user from Keycloak
     */
    public void deleteUserFromKeycloak(String keycloakUserId) throws Exception {
        try {
            log.info("Deleting user from Keycloak: {}", keycloakUserId);

            String adminToken = getAdminToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Void> response = restTemplate.exchange(
                keycloakConfig.getUsersUrl() + "/" + keycloakUserId,
                HttpMethod.DELETE,
                request,
                Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info(
                    "User deleted successfully from Keycloak: {}",
                    keycloakUserId
                );
            } else {
                throw new RuntimeException(
                    "Failed to delete user from Keycloak: " +
                        response.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error("Failed to delete user from Keycloak", e);
            throw new RuntimeException(
                "Keycloak user deletion failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Assign user to group based on role
     */
    public void assignUserToGroup(String userId, String roleName)
        throws Exception {
        try {
            log.info(
                "Assigning user {} to group based on role: {}",
                userId,
                roleName
            );

            String adminToken = getAdminToken();
            String groupName = getGroupNameForRole(roleName);

            // First, get the group ID by name
            String groupId = getGroupIdByName(groupName, adminToken);

            if (groupId == null) {
                throw new RuntimeException("Group not found: " + groupName);
            }

            // Assign user to group
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);

            // Create group assignment payload
            Map<String, Object> groupAssignment = new HashMap<>();
            groupAssignment.put("id", groupId);
            groupAssignment.put("name", groupName);
            groupAssignment.put("path", "/" + groupName);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                groupAssignment,
                headers
            );

            ResponseEntity<Void> response = restTemplate.exchange(
                keycloakConfig.getUserGroupsUrl(userId) + "/" + groupId,
                HttpMethod.PUT,
                request,
                Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info(
                    "User {} successfully assigned to group: {}",
                    userId,
                    groupName
                );
            } else {
                throw new RuntimeException(
                    "Failed to assign user to group: " +
                        response.getStatusCode()
                );
            }
        } catch (Exception e) {
            log.error("Failed to assign user to group", e);
            throw new RuntimeException(
                "Group assignment failed: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Get group name based on user role
     */
    private String getGroupNameForRole(String roleName) {
        switch (roleName.toUpperCase()) {
            case "AUTHOR":
                return "Authors";
            case "ADMIN":
                return "Administrators";
            default:
                return "Authors"; // Default to Authors group
        }
    }

    /**
     * Get group ID by group name
     */
    private String getGroupIdByName(String groupName, String adminToken)
        throws Exception {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Object[]> response = restTemplate.exchange(
                keycloakConfig.getGroupsUrl(),
                HttpMethod.GET,
                request,
                Object[].class
            );

            if (
                response.getStatusCode().is2xxSuccessful() &&
                response.getBody() != null
            ) {
                for (Object groupObj : response.getBody()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> group = (Map<String, Object>) groupObj;
                    String name = (String) group.get("name");

                    if (groupName.equals(name)) {
                        return (String) group.get("id");
                    }
                }
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to get group ID for group: {}", groupName, e);
            throw e;
        }
    }
}
