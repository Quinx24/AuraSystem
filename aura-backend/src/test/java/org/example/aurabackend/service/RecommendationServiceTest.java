package org.example.aurabackend.service;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.dto.response.RecommendationResult;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.recommendation.CandidateGenerator;
import org.example.aurabackend.recommendation.PersonalizedQuestScorer;
import org.example.aurabackend.recommendation.RecommendationExplanation;
import org.example.aurabackend.recommendation.TopNSelector;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for RecommendationService.
 */
@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private CandidateGenerator candidateGenerator;
    
    @Mock
    private PersonalizedQuestScorer personalizedQuestScorer;
    
    @Mock
    private TopNSelector topNSelector;
    
    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private List<SideQuest> mockCandidates;
    private List<PersonalizedQuestScorer.ScoredQuest> mockScoredQuests;
    private List<SideQuest> mockTopQuests;

    @BeforeEach
    void setUp() {
        mockCandidates = List.of(
                SideQuest.builder().id(1L).title("Quest 1").emotion(Emotion.HAPPY).category(SideQuestCategory.SELF_CARE).xpReward(10).build(),
                SideQuest.builder().id(2L).title("Quest 2").emotion(Emotion.HAPPY).category(SideQuestCategory.EXERCISE).xpReward(20).build(),
                SideQuest.builder().id(3L).title("Quest 3").emotion(Emotion.HAPPY).category(SideQuestCategory.MINDFULNESS).xpReward(30).build()
        );

        mockScoredQuests = new ArrayList<>();
        mockScoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(mockCandidates.get(0), 0.9));
        mockScoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(mockCandidates.get(1), 0.8));
        mockScoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(mockCandidates.get(2), 0.7));

        mockTopQuests = List.of(mockCandidates.get(0), mockCandidates.get(1));
    }

    @Test
    @DisplayName("recommendQuests orchestrates complete pipeline")
    void recommendQuests_orchestratesCompletePipeline() {
        when(candidateGenerator.generateCandidates(eq(1L), eq(Emotion.HAPPY))).thenReturn(mockCandidates);
        when(personalizedQuestScorer.scoreQuests(eq(mockCandidates), any(Long.class), eq(Emotion.HAPPY)))
                .thenReturn(mockScoredQuests);
        when(topNSelector.selectTopN(eq(mockScoredQuests), any(Integer.class))).thenReturn(mockTopQuests);

        List<SideQuest> recommendations = recommendationService.recommendQuests(1L, Emotion.HAPPY);

        assertThat(recommendations).hasSize(2);
        verify(candidateGenerator).generateCandidates(eq(1L), eq(Emotion.HAPPY));
        verify(personalizedQuestScorer).scoreQuests(eq(mockCandidates), any(Long.class), eq(Emotion.HAPPY));
        verify(topNSelector).selectTopN(eq(mockScoredQuests), any(Integer.class));
    }

    @Test
    @DisplayName("recommendQuests returns empty list when no candidates")
    void recommendQuests_returnsEmptyListWhenNoCandidates() {
        when(candidateGenerator.generateCandidates(eq(1L), eq(Emotion.HAPPY))).thenReturn(List.of());

        List<SideQuest> recommendations = recommendationService.recommendQuests(1L, Emotion.HAPPY);

        assertThat(recommendations).isEmpty();
        verify(candidateGenerator).generateCandidates(eq(1L), eq(Emotion.HAPPY));
    }

    @Test
    @DisplayName("recommendQuestsWithCustomOrchestrates pipeline with custom count")
    void recommendQuestsWithCustomCount_orchestratesPipelineWithCustomCount() {
        when(candidateGenerator.generateCandidates(eq(1L), eq(Emotion.HAPPY))).thenReturn(mockCandidates);
        when(personalizedQuestScorer.scoreQuests(eq(mockCandidates), any(Long.class), eq(Emotion.HAPPY)))
                .thenReturn(mockScoredQuests);
        when(topNSelector.selectTopN(eq(mockScoredQuests), eq(5))).thenReturn(mockTopQuests);

        List<SideQuest> recommendations = recommendationService.recommendQuests(1L, Emotion.HAPPY, 5);

        assertThat(recommendations).hasSize(2);
        verify(topNSelector).selectTopN(eq(mockScoredQuests), eq(5));
    }

    @Test
    @DisplayName("recommendQuestsWithThreshold applies minimum score filter")
    void recommendQuestsWithThreshold_appliesMinimumScoreFilter() {
        when(candidateGenerator.generateCandidates(eq(1L), eq(Emotion.HAPPY))).thenReturn(mockCandidates);
        when(personalizedQuestScorer.scoreQuests(eq(mockCandidates), any(Long.class), eq(Emotion.HAPPY)))
                .thenReturn(mockScoredQuests);
        when(topNSelector.selectTopNWithThreshold(eq(mockScoredQuests), eq(3), eq(0.8)))
                .thenReturn(mockTopQuests);

        List<SideQuest> recommendations = recommendationService.recommendQuestsWithThreshold(
                1L, Emotion.HAPPY, 3, 0.8);

        assertThat(recommendations).hasSize(2);
        verify(topNSelector).selectTopNWithThreshold(eq(mockScoredQuests), eq(3), eq(0.8));
    }

    @Test
    @DisplayName("recommendQuestResults returns quest, score, explanation and confidence")
    void recommendQuestResults_returnsRecommendationResult() {
        User user = User.builder().id(1L).build();
        RecommendationExplanation explanation = RecommendationExplanation.builder()
                .questId(1L)
                .questTitle("Quest 1")
                .confidence(0.9)
                .reasons(List.of("Aligns with your recent emotion: HAPPY"))
                .build();

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(candidateGenerator.generateCandidates(eq(1L), eq(Emotion.HAPPY))).thenReturn(mockCandidates);
        when(personalizedQuestScorer.scoreQuests(eq(mockCandidates), eq(1L), eq(Emotion.HAPPY)))
                .thenReturn(mockScoredQuests);
        when(topNSelector.selectTopScored(eq(mockScoredQuests), eq(2)))
                .thenReturn(mockScoredQuests.subList(0, 2));
        when(personalizedQuestScorer.scoreQuestWithExplanation(any(SideQuest.class), eq(1L), eq(Emotion.HAPPY)))
                .thenReturn(new PersonalizedQuestScorer.ScoredQuestWithExplanation(mockCandidates.get(0), 0.9, explanation));

        List<RecommendationResult> results = recommendationService.recommendQuestResults(Emotion.HAPPY, 2);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getQuest().getTitle()).isEqualTo("Quest 1");
        assertThat(results.get(0).getScore()).isEqualTo(0.9);
        assertThat(results.get(0).getExplanations()).contains("Aligns with your recent emotion: HAPPY");
        assertThat(results.get(0).getConfidence()).isEqualTo(0.9);
    }
}
