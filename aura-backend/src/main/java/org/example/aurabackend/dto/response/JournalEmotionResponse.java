package org.example.aurabackend.dto.response;

import org.example.aurabackend.enumeration.Emotion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEmotionResponse {

    private Emotion emotion;

    private Double score;
}
