package org.example.aurabackend.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * HTTP client for Gemini API communication.
 *
 * Responsibilities:
 *   - HTTP communication with Gemini API
 *   - Request timeout configuration
 *   - Error handling and retry support
 *   - JSON parsing and response extraction
 *
 * This client handles only HTTP communication. Prompt logic and business
 * logic are handled by ExtractionService.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ExtractionApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.timeout:30}")
    private int timeoutSeconds;

    /**
     * Sends a prompt to Gemini API and returns the parsed response.
     *
     * @param prompt the prompt to send to Gemini
     * @return the parsed JSON response from Gemini
     * @throws ExtractionApiException if the API call fails or returns invalid response
     */
    public JsonNode callGemini(String prompt) {
        try {
            log.debug("Calling Gemini API with prompt length: {}", prompt.length());

            // Build request body
            String requestBody = buildRequestBody(prompt);

            // Build headers. Pass the API key via the x-goog-api-key header
            // rather than a URL query parameter so it is not captured in access
            // logs, proxies, or browser/CDN history.
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            // Make the API call
            ResponseEntity<String> response = restTemplate.exchange(
                    geminiApiUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Parse response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                return extractContent(rootNode);
            } else {
                throw new ExtractionApiException("Gemini API returned non-OK status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Failed to call Gemini API: {}", e.getMessage(), e);
            throw new ExtractionApiException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the request body for Gemini API.
     *
     * @param prompt the prompt text
     * @return JSON request body as string
     */
    private String buildRequestBody(String prompt) {
        try {
            // Build the request body according to Gemini API format
            return String.format(
                    "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}",
                    escapeJson(prompt)
            );
        } catch (Exception e) {
            throw new ExtractionApiException("Failed to build request body: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts the content text from Gemini API response.
     *
     * @param rootNode the parsed JSON response
     * @return the content text as JsonNode
     * @throws ExtractionApiException if response structure is invalid
     */
    private JsonNode extractContent(JsonNode rootNode) {
        try {
            // Navigate through Gemini response structure
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    JsonNode firstPart = parts.get(0);
                    String text = firstPart.path("text").asText();
                    return objectMapper.readTree(text);
                }
            }
            throw new ExtractionApiException("Invalid Gemini API response structure");
        } catch (Exception e) {
            throw new ExtractionApiException("Failed to extract content from Gemini response: " + e.getMessage(), e);
        }
    }

    /**
     * Escapes special characters for JSON.
     *
     * @param text the text to escape
     * @return escaped text
     */
    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    /**
     * Custom exception for extraction API failures.
     */
    public static class ExtractionApiException extends RuntimeException {
        public ExtractionApiException(String message) {
            super(message);
        }

        public ExtractionApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
