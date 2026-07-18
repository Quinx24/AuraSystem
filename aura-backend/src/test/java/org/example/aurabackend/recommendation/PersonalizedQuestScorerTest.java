package org.example.aurabackend.recommendation;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.repository.UserActivityStatRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.scoring.ActivityCategoryMapping;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for PersonalizedQuestScorer.
 */
@ExtendWith(MockitoExtension.class)
class PersonalizedQuestScorerTest {

    @Mock
    private UserPreferenceProfileRepository userPreferenceProfileRepository;
    
    @Mock
    private UserActivityStatRepository userActivityStatRepository;
    
    @Mock
    private ActivityCategoryMapping activityCategoryMapping;

    @Mock
    private RecommendationWeights recommendationWeights;

    @InjectMocks
    private PersonalizedQuestScorer scorer;

    private SideQuest quest;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        quest = SideQuest.builder()
                .id(1L)
                .title("Test Quest")
                .emotion(Emotion.HAPPY)
                .category(SideQuestCategory.EXERCISE)
                .build();

        // Mock recommendation weights with default values
        org.mockito.Mockito.lenient().when(recommendationWeights.getEmotion()).thenReturn(0.35);
        org.mockito.Mockito.lenient().when(recommendationWeights.getCategory()).thenReturn(0.25);
        org.mockito.Mockito.lenient().when(recommendationWeights.getActivity()).thenReturn(0.20);
        org.mockito.Mockito.lenient().when(recommendationWeights.getHistory()).thenReturn(0.10);
        org.mockito.Mockito.lenient().when(recommendationWeights.getDiversity()).thenReturn(0.10);
        org.mockito.Mockito.lenient().when(recommendationWeights.getFutureDecay()).thenReturn(0.05);
    }

    @Test
    @DisplayName("scoreQuest returns high score for exact emotion match")
    void scoreQuest_returns1ForExactEmotionMatch() {
        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());
        
        double score = scorer.scoreQuest(quest, userId, Emotion.HAPPY);
        // Score is weighted combination: emotion (1.0 * 0.3) + category (0.5 * 0.4) + activity (0.5 * 0.2) + diversity (0.5 * 0.1) = 0.3 + 0.2 + 0.1 + 0.05 = 0.65
        assertThat(score).isGreaterThan(0.5);
    }

    @Test
    @DisplayName("scoreQuest returns moderate score for compatible emotion")
    void scoreQuest_returns07ForCompatibleEmotion() {
        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());
        
        double score = scorer.scoreQuest(quest, userId, Emotion.EXCITED);
        // Score is weighted combination: emotion (0.7 * 0.3) + category (0.5 * 0.4) + activity (0.5 * 0.2) + diversity (0.5 * 0.1)
        assertThat(score).isGreaterThan(0.4);
    }

    @Test
    @DisplayName("scoreQuest returns low score for incompatible emotion")
    void scoreQuest_returns02ForIncompatibleEmotion() {
        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());
        
        double score = scorer.scoreQuest(quest, userId, Emotion.SAD);
        // Score is weighted combination: emotion (0.2 * 0.3) + category (0.5 * 0.4) + activity (0.5 * 0.2) + diversity (0.5 * 0.1)
        assertThat(score).isLessThan(0.5);
    }

    @Test
    @DisplayName("scoreQuest uses category weight from profile")
    void scoreQuest_usesCategoryWeightFromProfile() {
        UserPreferenceProfile profile = UserPreferenceProfile.builder()
                .categoryWeights(Map.of(SideQuestCategory.EXERCISE.name(), 0.9))
                .build();
        
        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());

        double score = scorer.scoreQuest(quest, userId, Emotion.HAPPY);
        
        assertThat(score).isGreaterThan(0.5); // Should be higher due to category weight
    }

    @Test
    @DisplayName("scoreQuest returns neutral score when no profile exists")
    void scoreQuest_returnsNeutralScoreWhenNoProfile() {
        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());

        double score = scorer.scoreQuest(quest, userId, Emotion.HAPPY);
        
        assertThat(score).isBetween(0.0, 1.0);
    }

    @Test
    @DisplayName("scoreQuests scores all quests in list")
    void scoreQuests_scoresAllQuestsInList() {
        SideQuest quest2 = SideQuest.builder()
                .id(2L)
                .title("Quest 2")
                .emotion(Emotion.HAPPY)
                .category(SideQuestCategory.CREATIVITY)
                .build();

        org.mockito.Mockito.lenient().when(userPreferenceProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        org.mockito.Mockito.lenient().when(activityCategoryMapping.getCategoryForActivity(any())).thenReturn(SideQuestCategory.EXERCISE.name());
        org.mockito.Mockito.lenient().when(userActivityStatRepository.findByUserId(userId)).thenReturn(List.of());

        List<PersonalizedQuestScorer.ScoredQuest> scored = scorer.scoreQuests(
                List.of(quest, quest2), userId, Emotion.HAPPY);

        assertThat(scored).hasSize(2);
        assertThat(scored).allMatch(sq -> sq.getScore() >= 0.0 && sq.getScore() <= 1.0);
    }
}
