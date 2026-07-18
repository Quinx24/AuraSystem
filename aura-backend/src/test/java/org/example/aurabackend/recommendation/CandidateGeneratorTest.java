package org.example.aurabackend.recommendation;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.recommendation.strategy.ColdStartCandidateStrategy;
import org.example.aurabackend.recommendation.strategy.EmotionCandidateStrategy;
import org.example.aurabackend.recommendation.strategy.HistoryCandidateStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for CandidateGenerator.
 */
@ExtendWith(MockitoExtension.class)
class CandidateGeneratorTest {

    @Mock
    private SideQuestRepository sideQuestRepository;

    @Mock
    private UserPreferenceProfileRepository userPreferenceProfileRepository;

    @Mock
    private EmotionCandidateStrategy emotionCandidateStrategy;

    @Mock
    private HistoryCandidateStrategy historyCandidateStrategy;

    @Mock
    private ColdStartCandidateStrategy coldStartCandidateStrategy;

    @InjectMocks
    private CandidateGenerator candidateGenerator;

    private List<SideQuest> mockQuests;

    @BeforeEach
    void setUp() {
        mockQuests = List.of(
                SideQuest.builder()
                        .id(1L)
                        .title("Quest 1")
                        .emotion(Emotion.HAPPY)
                        .published(true)
                        .build(),
                SideQuest.builder()
                        .id(2L)
                        .title("Quest 2")
                        .emotion(Emotion.HAPPY)
                        .published(true)
                        .build()
        );
    }

    @Test
    @DisplayName("generateCandidates with userId and emotion returns candidates")
    void generateCandidates_returnsCandidatesForUserAndEmotion() {
        Long userId = 1L;
        when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(java.util.Optional.empty());
        when(coldStartCandidateStrategy.generateCandidates(userId, Emotion.HAPPY)).thenReturn(mockQuests);

        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, Emotion.HAPPY);

        assertThat(candidates).hasSize(2);
        assertThat(candidates).extracting(SideQuest::getId).containsExactly(1L, 2L);
        verify(coldStartCandidateStrategy).generateCandidates(userId, Emotion.HAPPY);
    }

    @Test
    @DisplayName("generateCandidates returns empty list when no quests found")
    void generateCandidates_returnsEmptyListWhenNoQuestsFound() {
        Long userId = 1L;
        when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(java.util.Optional.empty());
        when(coldStartCandidateStrategy.generateCandidates(userId, Emotion.HAPPY)).thenReturn(List.of());

        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, Emotion.HAPPY);

        assertThat(candidates).isEmpty();
        verify(coldStartCandidateStrategy).generateCandidates(userId, Emotion.HAPPY);
    }

    @Test
    @DisplayName("generateCandidates uses history strategy when profile exists with high confidence")
    void generateCandidates_usesHistoryStrategyWhenProfileExists() {
        Long userId = 1L;
        UserPreferenceProfile profile = UserPreferenceProfile.builder()
                .confidenceScore(0.8)
                .preferredCategories(List.of("EXERCISE"))
                .build();
        
        when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(java.util.Optional.of(profile));
        when(historyCandidateStrategy.generateCandidates(userId, Emotion.HAPPY)).thenReturn(mockQuests);

        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, Emotion.HAPPY);

        assertThat(candidates).hasSize(2);
        verify(historyCandidateStrategy).generateCandidates(userId, Emotion.HAPPY);
    }

    @Test
    @DisplayName("generateCandidates uses cold start strategy when profile has low confidence")
    void generateCandidates_usesColdStartStrategyWhenLowConfidence() {
        Long userId = 1L;
        UserPreferenceProfile profile = UserPreferenceProfile.builder()
                .confidenceScore(0.2)
                .build();
        
        when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(java.util.Optional.of(profile));
        when(coldStartCandidateStrategy.generateCandidates(userId, Emotion.HAPPY)).thenReturn(mockQuests);

        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, Emotion.HAPPY);

        assertThat(candidates).hasSize(2);
        verify(coldStartCandidateStrategy).generateCandidates(userId, Emotion.HAPPY);
    }
}
