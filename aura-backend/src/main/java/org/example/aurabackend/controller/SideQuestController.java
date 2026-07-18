package org.example.aurabackend.controller;

import java.util.List;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.RecommendationResult;
import org.example.aurabackend.dto.response.SideQuestResponse;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.service.RecommendationService;
import org.example.aurabackend.service.SideQuestService;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/side-quests")
public class SideQuestController {

    private final SideQuestService sideQuestService;
    private final RecommendationService recommendationService;

    @GetMapping("/emotion/{emotion}")
    public ApiResponse<List<SideQuestResponse>> getByEmotion(
            @PathVariable Emotion emotion) {

        return ApiResponse.<List<SideQuestResponse>>builder()
                .result(sideQuestService.getByEmotion(emotion))
                .build();
    }

    @GetMapping
    public ApiResponse<List<SideQuestResponse>> getAll(
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {

        return ApiResponse.<List<SideQuestResponse>>builder()
                .result(sideQuestService.getAll(mood, category, sort))
                .build();
    }

    @GetMapping("/recommendations")
    public ApiResponse<List<RecommendationResult>> getRecommendations(
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(defaultValue = "3") int limit) {

        int safeLimit = Math.max(1, Math.min(limit, 10));

        return ApiResponse.<List<RecommendationResult>>builder()
                .result(recommendationService.recommendQuestResults(emotion, safeLimit))
                .build();
    }

    // @PostMapping("/add")
    // public ApiResponse<Void> addSideQuest(@RequestBody AddSideQuestRequest
    // request) {
    // sideQuestService.addQuest(request.getSideQuestId());

    // return ApiResponse.<Void>builder()
    // .message("Quest added successfully")
    // .build();
    // }
}
