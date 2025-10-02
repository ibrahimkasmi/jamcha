package ma.jamcha.jamcha.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpMethod;

@ConfigurationProperties(prefix = "security")
public class SecurityEndpointsProperties {

    private List<EndpointConfig> publicEndpoints = List.of();
    private List<EndpointConfig> adminEndpoints = List.of();
    private List<EndpointConfig> authorEndpoints = List.of();

    public List<EndpointConfig> getPublicEndpoints() {
        return publicEndpoints;
    }

    public void setPublicEndpoints(List<EndpointConfig> publicEndpoints) {
        this.publicEndpoints = publicEndpoints;
    }

    public List<EndpointConfig> getAdminEndpoints() {
        return adminEndpoints;
    }

    public void setAdminEndpoints(List<EndpointConfig> adminEndpoints) {
        this.adminEndpoints = adminEndpoints;
    }

    public List<EndpointConfig> getAuthorEndpoints() {
        return authorEndpoints;
    }

    public void setAuthorEndpoints(List<EndpointConfig> authorEndpoints) {
        this.authorEndpoints = authorEndpoints;
    }

    public static class EndpointConfig {
        private String pattern;
        private List<HttpMethod> methods;

        // Default constructor
        public EndpointConfig() {}

        // Constructor for pattern-only (all methods)
        public EndpointConfig(String pattern) {
            this.pattern = pattern;
        }

        // Constructor for pattern with specific methods
        public EndpointConfig(String pattern, List<HttpMethod> methods) {
            this.pattern = pattern;
            this.methods = methods;
        }

        public String getPattern() {
            return pattern;
        }

        public void setPattern(String pattern) {
            this.pattern = pattern;
        }

        public List<HttpMethod> getMethods() {
            return methods;
        }

        public void setMethods(List<HttpMethod> methods) {
            this.methods = methods;
        }

        /**
         * Helper method to check if all HTTP methods are allowed
         * @return true if no specific methods are defined (allowing all methods)
         */
        public boolean allowsAllMethods() {
            return methods == null || methods.isEmpty();
        }

        @Override
        public String toString() {
            return "EndpointConfig{" +
                    "pattern='" + pattern + '\'' +
                    ", methods=" + methods +
                    '}';
        }
    }
}