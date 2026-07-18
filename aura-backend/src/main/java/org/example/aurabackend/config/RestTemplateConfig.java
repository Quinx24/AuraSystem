package org.example.aurabackend.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Provides a shared RestTemplate bean with sensible timeouts.
 *
 * connect-timeout : 10 s  – abort if the remote server cannot be reached
 * read-timeout    : 30 s  – abort if the remote server stops sending data
 *
 * These values protect the journal-creation @Transactional boundary from
 * holding a JDBC connection open indefinitely while the FastAPI /predict
 * endpoint is slow or unresponsive.
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(30))
                .build();
    }
}
