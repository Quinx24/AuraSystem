package org.example.aurabackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Configuration for asynchronous processing.
 *
 * Enables @Async support for the extraction pipeline and other
 * asynchronous operations in the application.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    // Default async configuration is sufficient for Milestone 2
    // Custom thread pool configuration can be added in future milestones
    // if needed for performance tuning
}
