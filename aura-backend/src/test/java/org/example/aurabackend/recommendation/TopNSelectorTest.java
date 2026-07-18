package org.example.aurabackend.recommendation;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for TopNSelector.
 */
class TopNSelectorTest {

    private TopNSelector topNSelector;
    private List<PersonalizedQuestScorer.ScoredQuest> scoredQuests;

    @BeforeEach
    void setUp() {
        topNSelector = new TopNSelector();
        
        SideQuest quest1 = SideQuest.builder().id(1L).title("Quest 1").emotion(Emotion.HAPPY).build();
        SideQuest quest2 = SideQuest.builder().id(2L).title("Quest 2").emotion(Emotion.HAPPY).build();
        SideQuest quest3 = SideQuest.builder().id(3L).title("Quest 3").emotion(Emotion.HAPPY).build();
        SideQuest quest4 = SideQuest.builder().id(4L).title("Quest 4").emotion(Emotion.HAPPY).build();
        SideQuest quest5 = SideQuest.builder().id(5L).title("Quest 5").emotion(Emotion.HAPPY).build();

        scoredQuests = new ArrayList<>();
        scoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(quest1, 0.8));
        scoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(quest2, 0.9));
        scoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(quest3, 0.7));
        scoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(quest4, 0.95));
        scoredQuests.add(new PersonalizedQuestScorer.ScoredQuest(quest5, 0.6));
    }

    @Test
    @DisplayName("selectTopN returns top N quests sorted by score")
    void selectTopN_returnsTopNQuestsSortedByScore() {
        List<SideQuest> topQuests = topNSelector.selectTopN(scoredQuests, 3);

        assertThat(topQuests).hasSize(3);
        assertThat(topQuests).extracting(SideQuest::getId).containsExactly(4L, 2L, 1L);
    }

    @Test
    @DisplayName("selectTopN with default N returns 3 quests")
    void selectTopN_withDefaultN_returns3Quests() {
        List<SideQuest> topQuests = topNSelector.selectTopN(scoredQuests);

        assertThat(topQuests).hasSize(3);
    }

    @Test
    @DisplayName("selectTopN handles N larger than candidate list")
    void selectTopN_handlesNLargerThanCandidateList() {
        List<SideQuest> topQuests = topNSelector.selectTopN(scoredQuests, 10);

        assertThat(topQuests).hasSize(5);
    }

    @Test
    @DisplayName("selectTopN handles empty candidate list")
    void selectTopN_handlesEmptyCandidateList() {
        List<SideQuest> topQuests = topNSelector.selectTopN(List.of(), 3);

        assertThat(topQuests).isEmpty();
    }

    @Test
    @DisplayName("selectTopNWithThreshold filters by minimum score")
    void selectTopNWithThreshold_filtersByMinimumScore() {
        List<SideQuest> topQuests = topNSelector.selectTopNWithThreshold(scoredQuests, 3, 0.8);

        // Scores >= 0.8: 0.8 (quest1), 0.9 (quest2), 0.95 (quest4) = 3 quests
        assertThat(topQuests).hasSize(3);
        assertThat(topQuests).extracting(SideQuest::getId).containsExactly(4L, 2L, 1L);
    }

    @Test
    @DisplayName("selectTopNWithThreshold returns empty when no quests meet threshold")
    void selectTopNWithThreshold_returnsEmptyWhenNoQuestsMeetThreshold() {
        List<SideQuest> topQuests = topNSelector.selectTopNWithThreshold(scoredQuests, 3, 0.99);

        assertThat(topQuests).isEmpty();
    }
}
