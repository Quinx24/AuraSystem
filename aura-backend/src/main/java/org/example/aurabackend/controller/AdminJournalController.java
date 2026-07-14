package org.example.aurabackend.controller;

import java.time.LocalDate;

import org.example.aurabackend.dto.response.AdminJournalResponse;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.service.AdminJournalService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/journal-entries")
@PreAuthorize("hasRole('ADMIN')")
public class AdminJournalController {

    private final AdminJournalService adminJournalService;

    @GetMapping
    public ApiResponse<Page<AdminJournalResponse>> getJournalEntries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String sort) {

        return ApiResponse.success(
                "Admin journal entries retrieved successfully",
                adminJournalService.getJournalEntries(page, size, username, search, emotion, date, sort));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminJournalResponse> getById(@PathVariable Long id) {
        return ApiResponse.success("Admin journal entry retrieved successfully", adminJournalService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminJournalService.delete(id);
        return ApiResponse.success("Admin journal entry deleted successfully", null);
    }
}
