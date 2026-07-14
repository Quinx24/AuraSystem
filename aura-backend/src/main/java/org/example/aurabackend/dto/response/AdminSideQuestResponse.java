package org.example.aurabackend.dto.response;

import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminSideQuestResponse {

    private Long id;

    private String title;

    private String description;

    private Integer xpReward;

    private Emotion emotion;

    private SideQuestCategory category;

    private Difficulty difficulty;

    private Boolean published;
}
