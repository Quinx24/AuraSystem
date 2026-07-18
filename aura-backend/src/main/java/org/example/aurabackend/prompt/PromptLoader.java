package org.example.aurabackend.prompt;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Loads prompts from resource files.
 *
 * Responsibilities:
 *   - Load prompt templates from classpath resources
 *   - Handle missing files gracefully
 *   - Provide prompt text for LLM calls
 *
 * Prompts are stored in resources/prompts/ directory and can be
 * replaced without recompiling the application.
 */
@Slf4j
@Component
public class PromptLoader {

    private static final String PROMPTS_BASE_PATH = "prompts/";

    /**
     * Loads a prompt from the resources directory.
     *
     * @param promptName the name of the prompt file (without .txt extension)
     * @return the prompt text
     * @throws PromptLoadException if the prompt file cannot be loaded
     */
    public String loadPrompt(String promptName) {
        String resourcePath = PROMPTS_BASE_PATH + promptName + ".txt";
        
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new PromptLoadException("Prompt file not found: " + resourcePath);
            }
            
            String prompt = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            log.debug("Loaded prompt from: {}", resourcePath);
            return prompt;
            
        } catch (IOException e) {
            throw new PromptLoadException("Failed to load prompt: " + resourcePath, e);
        }
    }

    /**
     * Loads a prompt and formats it with the given parameters.
     *
     * @param promptName the name of the prompt file
     * @param params the parameters to format into the prompt
     * @return the formatted prompt
     */
    public String loadAndFormatPrompt(String promptName, Object... params) {
        String prompt = loadPrompt(promptName);
        return String.format(prompt, params);
    }

    /**
     * Custom exception for prompt loading failures.
     */
    public static class PromptLoadException extends RuntimeException {
        public PromptLoadException(String message) {
            super(message);
        }

        public PromptLoadException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
