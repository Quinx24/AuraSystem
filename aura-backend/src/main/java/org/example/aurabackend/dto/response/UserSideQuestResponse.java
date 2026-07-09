package org.example.aurabackend.dto.response;

import java.time.LocalDate;

import org.example.aurabackend.enumeration.SideQuestCategory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSideQuestResponse {

    private Long id;

    private Long sideQuestId;
    private Long sideQuestId;
    private String title;

    private String description;

    private Integer xpReward;

    private SideQuestCategory category;

    private Boolean completed;

    private LocalDate assignedDate;

    private LocalDate completedDate;
}