package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.LevelResponse;
import org.example.aurabackend.service.LevelService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/level")
public class LevelController {

    private final LevelService levelService;

    @GetMapping
    public ApiResponse<LevelResponse> getLevel() {

        return ApiResponse.<LevelResponse>builder()
                .result(levelService.getLevel())
                .build();
    }
}