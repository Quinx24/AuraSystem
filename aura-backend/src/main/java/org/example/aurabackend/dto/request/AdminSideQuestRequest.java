package org.example.aurabackend.dto.request;

import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminSideQuestRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title is too long")
    private String title;

    @Size(max = 1000, message = "Description is too long")
    private String description;

    @NotNull(message = "XP reward is required")
    @Min(value = 0, message = "XP reward must be greater than or equal to 0")
    private Integer xpReward;

    @NotNull(message = "Emotion is required")
    private Emotion emotion;

    @NotNull(message = "Category is required")
    private SideQuestCategory category;

    private Difficulty difficulty;

    private Boolean published;
}
