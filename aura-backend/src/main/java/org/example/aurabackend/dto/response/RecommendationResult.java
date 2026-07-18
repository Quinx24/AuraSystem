package org.example.aurabackend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecommendationResult {

    private SideQuestResponse quest;

    private Double score;

    private List<String> explanations;

    private Double confidence;

    private LocalDateTime recommendationTime;
}
