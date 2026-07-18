package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.aurabackend.dto.request.EmotionRequest;
import org.example.aurabackend.dto.response.EmotionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Calls the FastAPI PhoBERT emotion-classification service.
 *
 * PhoBERT is the sole owner of emotion classification — this service must
 * never be replaced with an LLM or any other model.
 *
 * The injected RestTemplate is configured with connect/read timeouts
 * (see RestTemplateConfig) so that a slow or unavailable FastAPI container
 * cannot hold a JDBC connection open indefinitely inside the journal-creation
 * @Transactional boundary.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmotionService {

    private final RestTemplate restTemplate;

    @Value("${emotion.service.url}")
    private String emotionServiceUrl;

    /**
     * Calls POST /predict and returns the full 7-class emotion result.
     *
     * @param text Vietnamese journal text
     * @return EmotionResponse containing primaryEmotion, confidence, and all scores
     * @throws RestClientException if the remote service is unreachable or returns an error
     */
    public EmotionResponse predictEmotion(String text) {
        log.debug("Calling emotion service at {} for text length={}", emotionServiceUrl, text.length());

        EmotionRequest request = new EmotionRequest(text);

        EmotionResponse response = restTemplate.postForObject(emotionServiceUrl, request, EmotionResponse.class);

        log.debug("Emotion service returned: emotion={}, confidence={}", response.getEmotion(), response.getConfidence());

        return response;
    }
}
