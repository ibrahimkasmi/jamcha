package ma.jamcha.jamcha.config;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@EnableConfigurationProperties({JwtProperties.class, SecurityEndpointsProperties.class})
public class SecurityConfig {

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private SecurityEndpointsProperties endpoints;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> {
                    // Configure public endpoints (no authentication required)
                    configureEndpoints(auth, endpoints.getPublicEndpoints(), EndpointSecurity.PERMIT_ALL);
// Configure author endpoints (AUTHOR or ADMIN role required)
                    configureEndpoints(auth, endpoints.getAuthorEndpoints(), EndpointSecurity.AUTHOR_OR_ADMIN);
                    // Configure admin endpoints (ADMIN role required)
                    configureEndpoints(auth, endpoints.getAdminEndpoints(), EndpointSecurity.ADMIN_ONLY);



                    // All other requests require authentication
                    auth.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )
                .build();
    }

    /**
     * Configure security for a list of endpoints
     */
    private void configureEndpoints(
            AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth,
            List<SecurityEndpointsProperties.EndpointConfig> endpointConfigs,
            EndpointSecurity security) {

        for (SecurityEndpointsProperties.EndpointConfig config : endpointConfigs) {
            if (config.allowsAllMethods()) {
                // No specific methods - apply to all HTTP methods
                applySecurityToEndpoint(auth, config.getPattern(), security);
            } else {
                // Specific methods defined
                HttpMethod[] methods = config.getMethods().toArray(new HttpMethod[0]);
                applySecurityToEndpointWithMethods(auth, methods, config.getPattern(), security);
            }
        }
    }

    /**
     * Apply security configuration to an endpoint pattern
     */
    private void applySecurityToEndpoint(
            AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth,
            String pattern,
            EndpointSecurity security) {

        switch (security) {
            case PERMIT_ALL:
                auth.requestMatchers(pattern).permitAll();
                break;
            case ADMIN_ONLY:
                auth.requestMatchers(pattern).hasRole("ADMIN");
                break;
            case AUTHOR_OR_ADMIN:
                auth.requestMatchers(pattern).hasAnyRole("AUTHOR", "ADMIN");
                break;
        }
    }

    /**
     * Apply security configuration to an endpoint pattern with specific HTTP methods
     */
    private void applySecurityToEndpointWithMethods(
            AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth,
            HttpMethod[] methods,
            String pattern,
            EndpointSecurity security) {

        for (HttpMethod method : methods) {
            switch (security) {
                case PERMIT_ALL:
                    auth.requestMatchers(method, pattern).permitAll();
                    break;
                case ADMIN_ONLY:
                    auth.requestMatchers(method, pattern).hasRole("ADMIN");
                    break;
                case AUTHOR_OR_ADMIN:
                    auth.requestMatchers(method, pattern).hasAnyRole("AUTHOR", "ADMIN");
                    break;
            }
        }
    }


    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(
                jwtProperties.getJwkSetUri()
        ).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Get realm roles from Keycloak token
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess == null) {
                return List.of();
            }

            Collection<String> roles = (Collection<String>) realmAccess.get("roles");
            if (roles == null) {
                return List.of();
            }

            // Convert roles to authorities with ROLE_ prefix
            return roles
                    .stream()
                    .filter(role -> role.equals("AUTHOR") || role.equals("ADMIN"))
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });
        converter.setPrincipalClaimName("preferred_username");
        return converter;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Enum to represent different endpoint security configurations
     */
    private enum EndpointSecurity {
        PERMIT_ALL,
        ADMIN_ONLY,
        AUTHOR_OR_ADMIN
    }
}
