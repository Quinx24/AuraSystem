package org.example.aurabackend.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakResponse {

    private Integer currentStreak;

    private Integer longestStreak;

    private Integer totalCheckIn;

    private LocalDate lastCheckIn;
    
}
