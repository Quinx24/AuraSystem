package org.example.aurabackend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import org.example.aurabackend.enumeration.Emotion;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private long totalUsers;

    private long totalJournals;

    private long totalSideQuests;

    private Emotion averageMood;

    private long journalsToday;

    private long newUsersThisWeek;

    private long newJournalsThisWeek;

    private Emotion topEmotion;

    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    public static class RecentActivity {

        private String type;

        private String title;

        private String description;

        private LocalDateTime createdAt;
    }
}
