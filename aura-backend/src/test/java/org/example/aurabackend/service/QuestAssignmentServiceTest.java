package org.example.aurabackend.service;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserSideQuestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link QuestAssignmentService}.
 *
 * Strategy: pure unit tests with Mockito mocks for both repositories.
 * No Spring context is loaded — tests run in milliseconds.
 *
 * Each test covers exactly one behaviour of assignQuestsForJournal().
 */
@ExtendWith(MockitoExtension.class)
class QuestAssignmentServiceTest {

    @Mock
    private SideQuestRepository sideQuestRepository;

    @Mock
    private UserSideQuestRepository userSideQuestRepository;

    @InjectMocks
    private QuestAssignmentService questAssignmentService;

    // ─── Shared fixtures ─────────────────────────────────────────────────────

    private User user;
    private JournalEntry journalEntry;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("hashed")
                .build();

        journalEntry = JournalEntry.builder()
                .id(10L)
                .journalContent("Hôm nay mình cảm thấy rất vui")
                .user(user)
                .build();
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    /**
     * Builds a published SideQuest with the given id and emotion.
     * Minimal fields only — tests that need more fields can override via setter.
     */
    private SideQuest buildQuest(Long id, Emotion emotion) {
        return SideQuest.builder()
                .id(id)
                .title("Quest " + id)
                .description("Description " + id)
                .xpReward(50)
                .emotion(emotion)
                .category(SideQuestCategory.MINDFULNESS)
                .difficulty(Difficulty.EASY)
                .published(true)
                .build();
    }

    // ─── Test 1: Happy path — fewer candidates than limit ────────────────────

    @Test
    @DisplayName("saves all candidates when count is below MAX_QUESTS_PER_JOURNAL")
    void assignQuestsForJournal_fewerCandidatesThanLimit_savesAll() {
        // given — 2 quests available, limit is 3
        List<SideQuest> candidates = List.of(
                buildQuest(1L, Emotion.HAPPY),
                buildQuest(2L, Emotion.HAPPY)
        );

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.HAPPY))
                .thenReturn(candidates);

        // no duplicates
        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(false);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.HAPPY, user);

        // then — save called exactly twice
        verify(userSideQuestRepository, times(2)).save(any(UserSideQuest.class));
    }

    // ─── Test 2: Limit enforced — more candidates than MAX ───────────────────

    @Test
    @DisplayName("saves at most MAX_QUESTS_PER_JOURNAL when more candidates exist")
    void assignQuestsForJournal_moreCandidatesThanLimit_savesOnlyMax() {
        // given — 5 quests available, limit is 3
        List<SideQuest> candidates = List.of(
                buildQuest(1L, Emotion.STRESS),
                buildQuest(2L, Emotion.STRESS),
                buildQuest(3L, Emotion.STRESS),
                buildQuest(4L, Emotion.STRESS),
                buildQuest(5L, Emotion.STRESS)
        );

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.STRESS))
                .thenReturn(candidates);

        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(false);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.STRESS, user);

        // then — exactly MAX saves
        verify(userSideQuestRepository, times(QuestAssignmentService.MAX_QUESTS_PER_JOURNAL))
                .save(any(UserSideQuest.class));
    }

    // ─── Test 3: No candidates → no saves ────────────────────────────────────

    @Test
    @DisplayName("does not call save when no published quests exist for the emotion")
    void assignQuestsForJournal_noCandidates_savesNothing() {
        // given — repository returns empty list
        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.SAD))
                .thenReturn(Collections.emptyList());

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.SAD, user);

        // then — no saves at all
        verify(userSideQuestRepository, never()).save(any(UserSideQuest.class));
    }

    // ─── Test 4: Idempotency — all quests already assigned ───────────────────

    @Test
    @DisplayName("skips all saves when every candidate is already assigned to this journal")
    void assignQuestsForJournal_allAlreadyAssigned_savesNothing() {
        // given — 2 quests, both already assigned
        List<SideQuest> candidates = List.of(
                buildQuest(1L, Emotion.ANXIETY),
                buildQuest(2L, Emotion.ANXIETY)
        );

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.ANXIETY))
                .thenReturn(candidates);

        // every duplicate check returns true
        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(true);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.ANXIETY, user);

        // then — no saves
        verify(userSideQuestRepository, never()).save(any(UserSideQuest.class));
    }

    // ─── Test 5: Idempotency — partial duplicates ────────────────────────────

    @Test
    @DisplayName("saves only non-duplicate quests when some candidates are already assigned")
    void assignQuestsForJournal_partialDuplicates_savesOnlyNew() {
        // given — 3 quests: quest 1 already assigned, quests 2 and 3 are new
        SideQuest quest1 = buildQuest(1L, Emotion.NEUTRAL);
        SideQuest quest2 = buildQuest(2L, Emotion.NEUTRAL);
        SideQuest quest3 = buildQuest(3L, Emotion.NEUTRAL);

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.NEUTRAL))
                .thenReturn(List.of(quest1, quest2, quest3));

        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                eq(user), eq(quest1), eq(journalEntry))).thenReturn(true);
        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                eq(user), eq(quest2), eq(journalEntry))).thenReturn(false);
        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                eq(user), eq(quest3), eq(journalEntry))).thenReturn(false);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.NEUTRAL, user);

        // then — quest1 skipped, quest2 and quest3 saved
        verify(userSideQuestRepository, times(2)).save(any(UserSideQuest.class));
    }

    // ─── Test 6: Exactly at limit ─────────────────────────────────────────────

    @Test
    @DisplayName("saves exactly MAX_QUESTS_PER_JOURNAL when candidates equal the limit")
    void assignQuestsForJournal_candidatesEqualLimit_savesAll() {
        // given — exactly 3 quests (equal to limit)
        List<SideQuest> candidates = List.of(
                buildQuest(1L, Emotion.EXCITED),
                buildQuest(2L, Emotion.EXCITED),
                buildQuest(3L, Emotion.EXCITED)
        );

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.EXCITED))
                .thenReturn(candidates);

        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(false);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.EXCITED, user);

        // then — all 3 saved
        verify(userSideQuestRepository, times(QuestAssignmentService.MAX_QUESTS_PER_JOURNAL))
                .save(any(UserSideQuest.class));
    }

    // ─── Test 7: Saved UserSideQuest field values ─────────────────────────────

    @Test
    @DisplayName("persisted UserSideQuest has correct user, journal, quest, completed=false, assignedDate=today")
    void assignQuestsForJournal_savedEntity_hasCorrectFieldValues() {
        // given — single quest
        SideQuest quest = buildQuest(99L, Emotion.ANGRY);

        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.ANGRY))
                .thenReturn(List.of(quest));

        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(false);

        // capture the saved entity
        ArgumentCaptor<UserSideQuest> captor = ArgumentCaptor.forClass(UserSideQuest.class);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.ANGRY, user);

        // then — inspect the captured argument
        verify(userSideQuestRepository).save(captor.capture());

        UserSideQuest saved = captor.getValue();

        assertThat(saved.getUser()).isEqualTo(user);
        assertThat(saved.getJournalEntry()).isEqualTo(journalEntry);
        assertThat(saved.getSideQuest()).isEqualTo(quest);
        assertThat(saved.getCompleted()).isFalse();
        assertThat(saved.getAssignedDate()).isEqualTo(LocalDate.now());
        assertThat(saved.getCompletedDate()).isNull();
    }

    // ─── Test 8: Correct repository method used for candidate retrieval ───────

    @Test
    @DisplayName("uses findByEmotionAndPublishedTrue (not findByEmotion) for candidate retrieval")
    void assignQuestsForJournal_usesPublishedFilteredQuery() {
        // given
        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.HAPPY))
                .thenReturn(Collections.emptyList());

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.HAPPY, user);

        // then — the SQL-filtered method is called
        verify(sideQuestRepository).findByEmotionAndPublishedTrue(Emotion.HAPPY);

        // and the unfiltered method is never called
        verify(sideQuestRepository, never()).findByEmotion(any());
    }

    // ─── Test 9: Single candidate (boundary) ─────────────────────────────────

    @Test
    @DisplayName("saves the single quest when exactly one candidate exists")
    void assignQuestsForJournal_singleCandidate_savesOne() {
        // given
        when(sideQuestRepository.findByEmotionAndPublishedTrue(Emotion.SAD))
                .thenReturn(List.of(buildQuest(7L, Emotion.SAD)));

        when(userSideQuestRepository.existsByUserAndSideQuestAndJournalEntry(
                any(), any(), any())).thenReturn(false);

        // when
        questAssignmentService.assignQuestsForJournal(journalEntry, Emotion.SAD, user);

        // then
        verify(userSideQuestRepository, times(1)).save(any(UserSideQuest.class));
    }
}
