package org.example.aurabackend.mapper;

import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.JournalExtractionResponse;
import org.example.aurabackend.entity.JournalExtraction;

/**
 * Mapper for JournalExtraction entity and DTOs.
 *
 * Responsibilities:
 *   - Entity → DTO conversion
 *   - Future DTO → Entity support (for write operations in Milestone 2+)
 *
 * SECURITY CONTRACT:
 *   This mapper deliberately excludes rawLlmResponse and extractionModel
 *   from all DTO mappings. These fields are audit-only and must never reach
 *   the public API layer.
 *
 * Usage:
 *   Controllers → Services → Mapper → Repository
 */
public class JournalExtractionMapper {

    /**
     * Maps a JournalExtraction entity to the full response DTO.
     *
     * SECURITY: rawLlmResponse and extractionModel are NOT mapped.
     * This is the enforcement point — any future field added to the entity
     * must be explicitly considered here before it reaches the API.
     */
    public static JournalExtractionResponse toFullResponse(JournalExtraction extraction) {
        if (extraction == null) {
            return null;
        }

        return JournalExtractionResponse.builder()
                .id(extraction.getId())
                .journalEntryId(extraction.getJournalEntry() != null ? extraction.getJournalEntry().getId() : null)
                .activities(extraction.getActivities())
                .places(extraction.getPlaces())
                .people(extraction.getPeople())
                .positiveTriggers(extraction.getPositiveTriggers())
                .negativeTriggers(extraction.getNegativeTriggers())
                .futurePlans(extraction.getFuturePlans())
                .moodContext(extraction.getMoodContext())
                .extractedAt(extraction.getExtractedAt())
                // rawLlmResponse — intentionally excluded (AUDIT ONLY)
                // extractionModel — intentionally excluded (internal metadata)
                .build();
    }

    /**
     * Maps a JournalExtraction entity to the lightweight summary DTO
     * used in the paginated history list.
     *
     * SECURITY: rawLlmResponse and extractionModel are NOT mapped.
     */
    public static ExtractionSummaryResponse toSummaryResponse(JournalExtraction extraction) {
        if (extraction == null) {
            return null;
        }

        return ExtractionSummaryResponse.builder()
                .id(extraction.getId())
                .journalEntryId(extraction.getJournalEntry() != null ? extraction.getJournalEntry().getId() : null)
                .activities(extraction.getActivities())
                .moodContext(extraction.getMoodContext())
                .extractedAt(extraction.getExtractedAt())
                .build();
    }

    /**
     * Future: DTO → Entity conversion for write operations.
     * This will be implemented in Milestone 2 when extraction creation is added.
     */
    // public static JournalExtraction toEntity(JournalExtractionRequest request) {
    //     // Implementation for Milestone 2
    // }
}
