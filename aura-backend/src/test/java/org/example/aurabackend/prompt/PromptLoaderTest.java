package org.example.aurabackend.prompt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for PromptLoader.
 */
class PromptLoaderTest {

    private PromptLoader promptLoader;

    @BeforeEach
    void setUp() {
        promptLoader = new PromptLoader();
    }

    @Test
    @DisplayName("loadPrompt loads existing prompt file")
    void loadPrompt_loadsExistingPromptFile() {
        String prompt = promptLoader.loadPrompt("journal-extraction");
        
        assertThat(prompt).isNotNull();
        assertThat(prompt).contains("journal entry");
        assertThat(prompt).contains("activities");
        assertThat(prompt).contains("JSON format");
    }

    @Test
    @DisplayName("loadAndFormatPrompt formats prompt with parameters")
    void loadAndFormatPrompt_formatsPromptWithParameters() {
        String prompt = promptLoader.loadAndFormatPrompt("journal-extraction", "Test journal content");
        
        assertThat(prompt).isNotNull();
        assertThat(prompt).contains("Test journal content");
    }

    @Test
    @DisplayName("loadPrompt throws exception for missing file")
    void loadPrompt_throwsExceptionForMissingFile() {
        assertThatThrownBy(() -> promptLoader.loadPrompt("non-existent-prompt"))
                .isInstanceOf(PromptLoader.PromptLoadException.class)
                .hasMessageContaining("not found");
    }
}
