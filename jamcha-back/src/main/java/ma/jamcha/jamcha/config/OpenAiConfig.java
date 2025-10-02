package ma.jamcha.jamcha.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info =@Info(
                contact = @Contact(
                        name = "ZENITHSOFT",
                        email = "elbaghazaoui.bahaa@gmail.com"
                ),
                description = "Documentation for Jamcha Project API",
                title = "Jamcha Specification - ZENITHSOFT",
                version = "1.0",
                termsOfService = "Terms of service"


        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8080"

                )
        },
        security = {
                @SecurityRequirement(
                        name = "JamchaBearerAuth"
                )
        }

)
@SecurityScheme(
        name = "JamchaBearerAuth",
        description = "Authenticate using the JWT auth token",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER

)

public class OpenAiConfig {
}
