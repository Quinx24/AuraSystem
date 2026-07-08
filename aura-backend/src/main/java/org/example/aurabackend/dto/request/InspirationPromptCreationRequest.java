package org.example.aurabackend.dto.request;

import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Language;
import org.example.aurabackend.enumeration.PromptCategory;
import org.example.aurabackend.enumeration.PromptType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InspirationPromptCreationRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Emotion cannot be null")
    private Emotion emotion;

    @NotNull(message = "Category cannot be null")
    private PromptCategory category;

    @NotNull(message = "Type cannot be null")
    private PromptType type;

    @NotNull(message = "Language cannot be null")
    private Language language;

    @NotNull(message = "Difficulty cannot be null")
    private Difficulty difficulty;

    @Min(value = 1, message = "Weight must be greater than or equal to 1")
    private Integer weight;

    private Boolean active;

    @Min(value = 0, message = "Display order must be greater than or equal to 0")
    private Integer displayOrder;
}
