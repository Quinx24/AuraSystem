package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

import org.example.aurabackend.enumeration.Emotion;

import java.util.List;

@Data
@Builder
public class JournalEntryResponse {

    private Long id;

    private String journalContent;

    private String noteToSelf;

    private Emotion primaryEmotion;

    private Double confidence;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Set<String> tags;

    private List<JournalEmotionResponse> emotions;
}
