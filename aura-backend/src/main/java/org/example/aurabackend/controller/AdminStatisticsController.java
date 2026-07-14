package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.StatisticsResponse;
import org.example.aurabackend.service.AdminStatisticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    @GetMapping
    public ApiResponse<StatisticsResponse> getStatistics() {
        return ApiResponse.success("Admin statistics retrieved successfully", adminStatisticsService.getStatistics());
    }
}
