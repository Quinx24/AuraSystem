package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.StreakResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.service.CurrentUserService;
import org.example.aurabackend.service.StreakService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/streak")
public class StreakController {

    private final StreakService streakService;

    @GetMapping
    public ApiResponse<StreakResponse> getStreak() {

        return ApiResponse.<StreakResponse>builder()
                .result(streakService.getStreak())
                .build();
    }
}
