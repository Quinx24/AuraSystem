package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.DashboardResponse;
import org.example.aurabackend.service.AdminDashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard() {
        return ApiResponse.success("Admin dashboard retrieved successfully", adminDashboardService.getDashboard());
    }
}
