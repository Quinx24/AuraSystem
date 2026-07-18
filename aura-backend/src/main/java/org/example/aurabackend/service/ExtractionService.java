package org.example.aurabackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.client.ExtractionApiClient;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.event.JournalCreatedEvent;
import org.example.aurabackend.prompt.PromptLoader;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalExtractionRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for LLM-based journal extraction orchestration.
 *
 * Responsibilities:
 *   - Receive journal creation events
 *   - Load prompts from resource files
 *   - Call Gemini API for extraction
 *   - Validate and parse responses
 *   - Persist JournalExtraction entities
 *   - Delegate statistics and profile updates to appropriate services
 *
 * This service handles LLM orchestration only. It does not:
 *   - Update UserPreferenceProfile directly (delegates to UserPreferenceProfileService)
 *   - Update UserActivityStats directly (delegates to UserActivityStatsService)
 *   - Perform recommendation logic (handled by RecommendationService)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExtractionService {

    private final ExtractionApiClient extractionApiClient;
    private final PromptLoader promptLoader;
    private final JournalEntryRepository journalEntryRepository;
    private final JournalExtractionRepository journalExtractionRepository;
    private final UserActivityStatsService userActivityStatsService;
    private final UserPreferenceProfileService userPreferenceProfileService;

    private static final int MAX_RETRIES = 3;
    private static final String PROMPT_NAME = "journal-extraction";

    /**
     * Processes journal extraction asynchronously.
     *
     * This method is called by the event listener after journal creation.
     * It handles the complete extraction pipeline.
     *
     * @param event the journal creation event
     */
    @Async
    @Transactional
    public void processJournalExtraction(JournalCreatedEvent event) {
        long startedAt = System.nanoTime();
        log.info("event=ExtractionStarted journalEntryId={} userId={}",
                event.getJournalEntryId(), event.getUserId());

        try {
            // Reload journal entry to ensure it's in the current transaction context
            JournalEntry journalEntry = journalEntryRepository.findById(event.getJournalEntryId())
                    .orElseThrow(() -> new IllegalStateException("Journal entry not found: " + event.getJournalEntryId()));

            // Check if extraction already exists (idempotency)
            if (journalExtractionRepository.existsByJournalEntry_Id(event.getJournalEntryId())) {
                log.info("Extraction already exists for journal entry ID: {}, skipping", event.getJournalEntryId());
                return;
            }

            ExtractionAttemptResult attemptResult = callGeminiWithRetry(event);

            // Create and persist extraction
            JournalExtraction extraction = createExtraction(
                    journalEntry,
                    attemptResult.extractionData(),
                    attemptResult.rawResponse()
            );
            journalExtractionRepository.save(extraction);

            log.info("event=ExtractionCompleted journalEntryId={} userId={} latencyMs={}",
                    event.getJournalEntryId(), event.getUserId(), elapsedMillis(startedAt));

            // Delegate statistics update
            userActivityStatsService.updateActivityStats(journalEntry.getUser(), attemptResult.extractionData());

            // Delegate profile recomputation
            userPreferenceProfileService.recomputeProfile(journalEntry.getUser());

        } catch (Exception e) {
            log.error("event=ExtractionFailed journalEntryId={} userId={} latencyMs={} errorType={} message={}",
                    event.getJournalEntryId(),
                    event.getUserId(),
                    elapsedMillis(startedAt),
                    e.getClass().getSimpleName(),
                    e.getMessage());
            throw e; // Will trigger retry if within max attempts
        }
    }

    private ExtractionAttemptResult callGeminiWithRetry(JournalCreatedEvent event) {
        String prompt = promptLoader.loadAndFormatPrompt(PROMPT_NAME, event.getJournalContent());
        RuntimeException lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                log.info("event=ExtractionAttempt journalEntryId={} userId={} attempt={}",
                        event.getJournalEntryId(), event.getUserId(), attempt);

                JsonNode response = extractionApiClient.callGemini(prompt);
                ExtractionData extractionData = validateAndParseResponse(response);
                return new ExtractionAttemptResult(extractionData, response.toString());
            } catch (RuntimeException exception) {
                lastException = exception;
                log.warn("event=ExtractionAttemptFailed journalEntryId={} userId={} attempt={} errorType={} message={}",
                        event.getJournalEntryId(),
                        event.getUserId(),
                        attempt,
                        exception.getClass().getSimpleName(),
                        exception.getMessage());
            }
        }

        throw lastException == null
                ? new ExtractionValidationException("Extraction failed without a captured exception")
                : lastException;
    }

    /**
     * Validates and parses the Gemini API response.
     *
     * @param response the JSON response from Gemini
     * @return parsed extraction data
     * @throws ExtractionValidationException if response is invalid
     */
    private ExtractionData validateAndParseResponse(JsonNode response) {
        try {
            ExtractionData data = new ExtractionData();

            // Extract activities
            JsonNode activities = response.path("activities");
            if (activities.isArray()) {
                activities.forEach(node -> data.activities.add(node.asText()));
            }

            // Extract places
            JsonNode places = response.path("places");
            if (places.isArray()) {
                places.forEach(node -> data.places.add(node.asText()));
            }

            // Extract people
            JsonNode people = response.path("people");
            if (people.isArray()) {
                people.forEach(node -> data.people.add(node.asText()));
            }

            // Extract positive triggers
            JsonNode positiveTriggers = response.path("positive_triggers");
            if (positiveTriggers.isArray()) {
                positiveTriggers.forEach(node -> data.positiveTriggers.add(node.asText()));
            }

            // Extract negative triggers
            JsonNode negativeTriggers = response.path("negative_triggers");
            if (negativeTriggers.isArray()) {
                negativeTriggers.forEach(node -> data.negativeTriggers.add(node.asText()));
            }

            // Extract future plans
            JsonNode futurePlans = response.path("future_plans");
            if (futurePlans.isArray()) {
                futurePlans.forEach(node -> data.futurePlans.add(node.asText()));
            }

            // Extract mood context
            data.moodContext = response.path("mood_context").asText();

            // Validate required fields
            if (data.moodContext == null || data.moodContext.trim().isEmpty()) {
                throw new ExtractionValidationException("mood_context is required");
            }

            return data;

        } catch (Exception e) {
            throw new ExtractionValidationException("Failed to validate extraction response: " + e.getMessage(), e);
        }
    }

    /**
     * Creates a JournalExtraction entity from parsed data.
     *
     * @param journalEntry the journal entry
     * @param data the parsed extraction data
     * @param rawResponse the raw Gemini response for audit
     * @return the JournalExtraction entity
     */
    private JournalExtraction createExtraction(JournalEntry journalEntry, ExtractionData data, String rawResponse) {
        return JournalExtraction.builder()
                .journalEntry(journalEntry)
                .user(journalEntry.getUser())
                .activities(data.activities.isEmpty() ? null : data.activities)
                .places(data.places.isEmpty() ? null : data.places)
                .people(data.people.isEmpty() ? null : data.people)
                .positiveTriggers(data.positiveTriggers.isEmpty() ? null : data.positiveTriggers)
                .negativeTriggers(data.negativeTriggers.isEmpty() ? null : data.negativeTriggers)
                .futurePlans(data.futurePlans.isEmpty() ? null : data.futurePlans)
                .moodContext(data.moodContext)
                .rawLlmResponse(rawResponse) // Stored for audit only
                .extractionModel("gemini-pro") // Track model version
                .build();
    }

    /**
     * Internal data structure for extraction parsing.
     */
    public static class ExtractionData {
        List<String> activities = new ArrayList<>();
        List<String> places = new ArrayList<>();
        List<String> people = new ArrayList<>();
        List<String> positiveTriggers = new ArrayList<>();
        List<String> negativeTriggers = new ArrayList<>();
        List<String> futurePlans = new ArrayList<>();
        String moodContext;
    }

    /**
     * Custom exception for extraction validation failures.
     */
    public static class ExtractionValidationException extends RuntimeException {
        public ExtractionValidationException(String message) {
            super(message);
        }

        public ExtractionValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    private record ExtractionAttemptResult(ExtractionData extractionData, String rawResponse) {
    }

    private long elapsedMillis(long startedAt) {
        return (System.nanoTime() - startedAt) / 1_000_000;
    }
}
