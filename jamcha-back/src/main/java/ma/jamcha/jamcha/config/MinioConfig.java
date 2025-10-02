package ma.jamcha.jamcha.config;
import io.minio.MinioClient;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
@ConfigurationProperties(prefix = "minio")
@Data
public class MinioConfig {

    private String url;

    private String accessKey;

    private String secretKey;

    @Bean

    public MinioClient minioClient() {

        try {
            return MinioClient.builder()
                    .endpoint(url)
                    .credentials(accessKey, secretKey)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error occurred when configuring minio",e);
        }
    }


}
