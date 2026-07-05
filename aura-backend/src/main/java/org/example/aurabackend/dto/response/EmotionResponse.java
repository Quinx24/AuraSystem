package org.example.aurabackend.dto.response;

import java.util.Map;

import org.example.aurabackend.enumeration.Emotion;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmotionResponse {
    private Emotion emotion;

    private Double confidence;

    private Map<Emotion, Double> scores;
}