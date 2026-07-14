package org.example.aurabackend.dto.response;

import java.util.List;

import org.example.aurabackend.enumeration.Emotion;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatisticsResponse {

    private List<TimeSeriesPoint> usersByMonth;

    private List<TimeSeriesPoint> journalsByMonth;

    private List<EmotionCount> emotionDistribution;

    private Emotion topEmotion;

    private List<TimeSeriesPoint> journalsByDay;

    private long activeUsers;

    private long completedQuests;

    @Data
    @Builder
    public static class TimeSeriesPoint {

        private String label;

        private long count;
    }

    @Data
    @Builder
    public static class EmotionCount {

        private Emotion emotion;

        private long count;
    }
}
