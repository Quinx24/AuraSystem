package org.example.aurabackend.controller;

import java.util.List;

import org.example.aurabackend.dto.request.AddSideQuestRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.UserSideQuestResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.service.CurrentUserService;
import org.example.aurabackend.service.SideQuestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user-side-quests")
@RequiredArgsConstructor
public class UserSideQuestController {

    private final SideQuestService sideQuestService;

    private final CurrentUserService currentUserService;

    @PostMapping
    public ApiResponse<Void> addSideQuest(@RequestBody AddSideQuestRequest request) {
        User user = currentUserService.getCurrentUser();
        sideQuestService.addQuest(user, request.getSideQuestId());

        return ApiResponse.<Void>builder()
                .message("Side-quest added successfully")
                .build();
    }

    @GetMapping("/today")
    public ApiResponse<List<UserSideQuestResponse>> getTodayQuests() {

        User user = currentUserService.getCurrentUser();

        List<UserSideQuestResponse> response = sideQuestService.getTodayQuest(user);

        return ApiResponse.success(
            "Today's side-quests retrieved successfully",
            response
        );
    }

    @PatchMapping("/{id}/complete")
    public ApiResponse<Void> completeSideQuest(@PathVariable Long id) {
        User user = currentUserService.getCurrentUser();
        
        sideQuestService.completeQuest(user, id);

        return ApiResponse.<Void>builder()
                .message("Side-quest completed successfully")
                .build();
    }

    @GetMapping("/completed")
    public ApiResponse<List<UserSideQuestResponse>> getCompletedQuest() {
        User user = currentUserService.getCurrentUser();

        List<UserSideQuestResponse> response = sideQuestService.getCompletedQuest(user);

        return ApiResponse.success(
            "Completed side-quests retrieved successfully",
            response
        );
    }
}
