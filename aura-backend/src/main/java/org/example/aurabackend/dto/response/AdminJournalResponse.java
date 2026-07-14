package org.example.aurabackend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.example.aurabackend.enumeration.Emotion;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminJournalResponse {

    private Long id;

    private String journalContent;

    private String noteToSelf;

    private Emotion primaryEmotion;

    private Double confidence;

    private Long userId;

    private String userFullName;

    private String userEmail;

    private Set<String> tags;

    private List<JournalEmotionResponse> emotions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
