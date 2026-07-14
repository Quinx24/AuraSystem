package org.example.aurabackend.controller;

import org.example.aurabackend.dto.request.AdminSideQuestRequest;
import org.example.aurabackend.dto.response.AdminSideQuestResponse;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.service.AdminSideQuestService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/side-quests")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSideQuestController {

    private final AdminSideQuestService adminSideQuestService;

    @GetMapping
    public ApiResponse<Page<AdminSideQuestResponse>> getSideQuests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) SideQuestCategory category,
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String sort) {

        return ApiResponse.success(
                "Admin side quests retrieved successfully",
                adminSideQuestService.getSideQuests(page, size, search, emotion, difficulty, category, published, sort));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminSideQuestResponse> getById(@PathVariable Long id) {
        return ApiResponse.success("Admin side quest retrieved successfully", adminSideQuestService.getById(id));
    }

    @PostMapping
    public ApiResponse<AdminSideQuestResponse> create(@Valid @RequestBody AdminSideQuestRequest request) {
        return ApiResponse.success("Admin side quest created successfully", adminSideQuestService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminSideQuestResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminSideQuestRequest request) {

        return ApiResponse.success("Admin side quest updated successfully", adminSideQuestService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminSideQuestService.delete(id);
        return ApiResponse.success("Admin side quest deleted successfully", null);
    }

    @PatchMapping("/{id}/publish")
    public ApiResponse<AdminSideQuestResponse> publish(@PathVariable Long id) {
        return ApiResponse.success("Admin side quest published successfully", adminSideQuestService.publish(id));
    }

    @PatchMapping("/{id}/unpublish")
    public ApiResponse<AdminSideQuestResponse> unpublish(@PathVariable Long id) {
        return ApiResponse.success("Admin side quest unpublished successfully", adminSideQuestService.unpublish(id));
    }
}
