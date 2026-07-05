package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LevelResponse {

    private Integer level;

    private Integer xp;

    private Integer requiredXp;

    private Integer progress;
}