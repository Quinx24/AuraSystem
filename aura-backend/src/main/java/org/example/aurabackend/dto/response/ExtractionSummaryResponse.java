package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Lightweight summary DTO for the paginated extraction history list.
 *
 * Used by GET /users/me/extractions — returns one record per extracted journal.
 * Intentionally lighter than JournalExtractionResponse (no places/people/
 * triggers/futurePlans) to keep paginated responses compact.
 *
 * SECURITY CONTRACT:
 *   rawLlmResponse and extractionModel are never included here.
 */
@Data
@Builder
public class ExtractionSummaryResponse {

    private Long id;

    /** ID of the journal entry this extraction belongs to. */
    private Long journalEntryId;

    /** Activities extracted from the journal — the primary interest for the list view. */
    private List<String> activities;

    /** One-sentence contextual summary. */
    private String moodContext;

    private LocalDateTime extractedAt;
}
