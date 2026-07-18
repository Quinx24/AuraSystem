package org.example.aurabackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.aurabackend.client.ExtractionApiClient;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.event.JournalCreatedEvent;
import org.example.aurabackend.prompt.PromptLoader;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalExtractionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExtractionServiceTest {

    @Mock
    private ExtractionApiClient extractionApiClient;

    @Mock
    private PromptLoader promptLoader;

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private JournalExtractionRepository journalExtractionRepository;

    @Mock
    private UserActivityStatsService userActivityStatsService;

    @Mock
    private UserPreferenceProfileService userPreferenceProfileService;

    @InjectMocks
    private ExtractionService extractionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("processJournalExtraction retries Gemini failures and stores extraction after success")
    void processJournalExtraction_retriesAndStoresExtraction() throws Exception {
        User user = User.builder().id(1L).build();
        JournalEntry journalEntry = JournalEntry.builder()
                .id(10L)
                .user(user)
                .journalContent("I walked and felt calm.")
                .build();
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        JsonNode geminiJson = objectMapper.readTree("""
                {
                  "activities": ["walking"],
                  "places": ["park"],
                  "people": [],
                  "positive_triggers": ["walking"],
                  "negative_triggers": [],
                  "future_plans": ["walk tomorrow"],
                  "mood_context": "Walking helped the user feel calmer."
                }
                """);

        when(journalEntryRepository.findById(10L)).thenReturn(Optional.of(journalEntry));
        when(journalExtractionRepository.existsByJournalEntry_Id(10L)).thenReturn(false);
        when(promptLoader.loadAndFormatPrompt(eq("journal-extraction"), eq("I walked and felt calm.")))
                .thenReturn("prompt");
        when(extractionApiClient.callGemini("prompt"))
                .thenThrow(new ExtractionApiClient.ExtractionApiException("timeout"))
                .thenThrow(new ExtractionApiClient.ExtractionApiException("invalid json"))
                .thenReturn(geminiJson);

        extractionService.processJournalExtraction(event);

        ArgumentCaptor<JournalExtraction> extractionCaptor = ArgumentCaptor.forClass(JournalExtraction.class);
        verify(extractionApiClient, times(3)).callGemini("prompt");
        verify(journalExtractionRepository).save(extractionCaptor.capture());
        verify(userActivityStatsService).updateActivityStats(eq(user), any(ExtractionService.ExtractionData.class));
        verify(userPreferenceProfileService).recomputeProfile(user);

        JournalExtraction savedExtraction = extractionCaptor.getValue();
        assertThat(savedExtraction.getJournalEntry()).isEqualTo(journalEntry);
        assertThat(savedExtraction.getUser()).isEqualTo(user);
        assertThat(savedExtraction.getActivities()).containsExactly("walking");
        assertThat(savedExtraction.getMoodContext()).isEqualTo("Walking helped the user feel calmer.");
        assertThat(savedExtraction.getRawLlmResponse()).contains("positive_triggers");
    }
}
