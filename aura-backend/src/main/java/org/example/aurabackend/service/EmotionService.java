package org.example.aurabackend.service;

import org.example.aurabackend.dto.request.EmotionRequest;
import org.example.aurabackend.dto.response.EmotionResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmotionService {
    
    private final RestTemplate restTemplate = new RestTemplate();

    public EmotionResponse predictEmotion(String text) {

        String url = "https://aurasystem-production.up.railway.app/predict";

        EmotionRequest request = new EmotionRequest(text);

        return restTemplate.postForObject(url, request, EmotionResponse.class);
    }
}
