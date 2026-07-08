package org.example.aurabackend.dto.response;

import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Language;
import org.example.aurabackend.enumeration.PromptCategory;
import org.example.aurabackend.enumeration.PromptType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InspirationPromptResponse {

    private Long id;

    private String title;

    private String description;

    private Emotion emotion;

    private PromptCategory category;

    private PromptType type;

    private Difficulty difficulty;

    private Language language;
}
