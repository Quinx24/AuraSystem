package org.example.aurabackend.controller;

import java.util.List;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.SideQuestResponse;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.service.SideQuestService;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/side-quests")
public class SideQuestController {

    private final SideQuestService sideQuestService;

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

    // @PostMapping("/add")
    // public ApiResponse<Void> addSideQuest(@RequestBody AddSideQuestRequest
    // request) {
    // sideQuestService.addQuest(request.getSideQuestId());

    // return ApiResponse.<Void>builder()
    // .message("Quest added successfully")
    // .build();
    // }
}
