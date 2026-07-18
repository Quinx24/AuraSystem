package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserSideQuestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Owns the logic for selecting and assigning side quests to a journal entry.
 *
 * Single Responsibility:
 *   This service answers one question — "which quests should be assigned to
 *   this journal entry given the detected emotion?" — and persists the result.
 *
 * This class was extracted from JournalEntryService to keep that class
 * focused on journal CRUD and reduce its dependency count.
 *
 * Architecture note (Milestone 0):
 *   Candidate selection uses findByEmotionAndPublishedTrue(), which pushes the
 *   published = true filter into SQL instead of applying it in Java streams.
 *   The selection is currently limited to MAX_QUESTS_PER_JOURNAL candidates.
 *   In Milestone 1 the selection step will be replaced by PersonalisedQuestScorer.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuestAssignmentService {

    /** Maximum number of quests assigned per journal entry. */
    static final int MAX_QUESTS_PER_JOURNAL = 3;

    private final SideQuestRepository sideQuestRepository;
    private final UserSideQuestRepository userSideQuestRepository;

    /**
     * Selects up to {@value MAX_QUESTS_PER_JOURNAL} published quests matching
     * the given emotion and creates a {@link UserSideQuest} record for each one,
     * linked to the provided journal entry.
     *
     * <p>A duplicate check via
     * {@link UserSideQuestRepository#existsByUserAndSideQuestAndJournalEntry}
     * prevents the same quest being assigned to the same journal twice if this
     * method is called more than once (e.g., during a retry).
     *
     * <p>This method is called inside the {@code @Transactional} boundary owned
     * by {@link JournalEntryService#createJournalEntry}, so all saves participate
     * in the same database transaction.
     *
     * @param journalEntry the persisted journal entry to attach quests to
     * @param emotion      the primary emotion detected for this journal
     * @param user         the authenticated user who owns the journal
     */
    public void assignQuestsForJournal(JournalEntry journalEntry, Emotion emotion, User user) {

        // Candidate retrieval — published filter applied in SQL (Task 2)
        List<SideQuest> candidates = sideQuestRepository.findByEmotionAndPublishedTrue(emotion);

        if (candidates.isEmpty()) {
            log.debug("No published quests found for emotion={}, skipping assignment for journal={}",
                    emotion, journalEntry.getId());
            return;
        }

        // Select up to MAX_QUESTS_PER_JOURNAL candidates.
        // NOTE: Collections.shuffle() is intentionally NOT used here.
        //       In Milestone 0 the first N quests are taken as-is.
        //       Milestone 1 will replace this with PersonalisedQuestScorer ranking.
        List<SideQuest> selected = candidates.stream()
                .limit(MAX_QUESTS_PER_JOURNAL)
                .toList();

        log.debug("Assigning {} quests (emotion={}) to journal={} for user={}",
                selected.size(), emotion, journalEntry.getId(), user.getId());

        for (SideQuest sideQuest : selected) {

            // Idempotency guard — prevents duplicate rows on retry
            boolean alreadyAssigned = userSideQuestRepository
                    .existsByUserAndSideQuestAndJournalEntry(user, sideQuest, journalEntry);

            if (alreadyAssigned) {
                log.debug("Quest={} already assigned to journal={}, skipping",
                        sideQuest.getId(), journalEntry.getId());
                continue;
            }

            UserSideQuest userSideQuest = UserSideQuest.builder()
                    .user(user)
                    .sideQuest(sideQuest)
                    .journalEntry(journalEntry)
                    .completed(false)
                    .assignedDate(LocalDate.now())
                    .build();

            userSideQuestRepository.save(userSideQuest);
        }
    }
}
