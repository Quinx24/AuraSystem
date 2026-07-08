package org.example.aurabackend.controller;

import java.util.List;

import org.example.aurabackend.dto.request.InspirationPromptCreationRequest;
import org.example.aurabackend.dto.request.InspirationPromptUpdateRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.InspirationPromptResponse;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.service.InspirationPromptService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inspiration-prompts")
@RequiredArgsConstructor
public class InspirationPromptController {

    private final InspirationPromptService inspirationPromptService;

    @GetMapping
    public ApiResponse<List<InspirationPromptResponse>> getAll() {
        return ApiResponse.success("All inspiration prompts retrieved successfully", inspirationPromptService.getAll());
    }

    @GetMapping("/active")
    public ApiResponse<List<InspirationPromptResponse>> getAllActive() {
        return ApiResponse.success("Active inspiration prompts retrieved successfully", inspirationPromptService.getAllActive());
    }

    @GetMapping("/random")
    public ApiResponse<InspirationPromptResponse> getRandom(
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) Long previousPromptId) {

        InspirationPromptResponse response;

        if (emotion != null && difficulty != null) {
            response = inspirationPromptService.getRandomByEmotionAndDifficulty(
                    emotion,
                    difficulty,
                    previousPromptId);
        } else if (emotion != null) {
            response = inspirationPromptService.getRandomByEmotion(emotion, previousPromptId);
        } else {
            response = inspirationPromptService.getRandom(previousPromptId);
        }

        return ApiResponse.success("Random inspiration prompt retrieved successfully", response);
    }

    @GetMapping("/random-list")
    public ApiResponse<List<InspirationPromptResponse>> getRandomList(
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(defaultValue = "3") Integer limit) {

        List<InspirationPromptResponse> response = emotion == null
                ? inspirationPromptService.getRandomList(limit)
                : inspirationPromptService.getRandomListByEmotion(emotion, limit);

        return ApiResponse.success("Random inspiration prompts retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<InspirationPromptResponse> getById(@PathVariable Long id) {
        return ApiResponse.success("Inspiration prompt retrieved successfully", inspirationPromptService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InspirationPromptResponse> create(@Valid @RequestBody InspirationPromptCreationRequest request) {
        return ApiResponse.success("Inspiration prompt created successfully", inspirationPromptService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InspirationPromptResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody InspirationPromptUpdateRequest request) {

        return ApiResponse.success("Inspiration prompt updated successfully", inspirationPromptService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        inspirationPromptService.delete(id);
        return ApiResponse.success("Inspiration prompt deleted successfully", null);
    }

    @PatchMapping("/{id}/enable")
    public ApiResponse<InspirationPromptResponse> enable(@PathVariable Long id) {
        return ApiResponse.success("Inspiration prompt enabled successfully", inspirationPromptService.enable(id));
    }

    @PatchMapping("/{id}/disable")
    public ApiResponse<InspirationPromptResponse> disable(@PathVariable Long id) {
        return ApiResponse.success("Inspiration prompt disabled successfully", inspirationPromptService.disable(id));
    }
}
