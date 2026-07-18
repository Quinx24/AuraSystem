package org.example.aurabackend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.example.aurabackend.service.ExtractionQueryService;
import org.example.aurabackend.service.JournalEntryService;
import org.example.aurabackend.dto.request.JournalEntryCreationRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.JournalExtractionResponse;
import org.example.aurabackend.dto.response.JournalEntryResponse;
import org.springframework.web.bind.annotation.PutMapping;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/journal-entries")
@RequiredArgsConstructor
public class JournalEntryController {
    
    private final JournalEntryService journalEntryService;
    private final ExtractionQueryService extractionQueryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<JournalEntryResponse> createJournalEntry(@Valid @RequestBody JournalEntryCreationRequest request) {
        
        return ApiResponse.success("Journal entry created successfully", journalEntryService.createJournalEntry(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<JournalEntryResponse> getJournalEntryById(@PathVariable Long id) {
        return ApiResponse.success("Journal entry retrieved successfully", journalEntryService.getJournalEntryById(id));
    }

    @GetMapping
    public ApiResponse<Page<JournalEntryResponse>> getAllEntries(
            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {
                
        return ApiResponse.success("All journal entries retrieved successfully", journalEntryService.getAllEntries(page, size));
    }

    @PutMapping("/{id}")
    public ApiResponse<JournalEntryResponse> updateJournalEntry(@PathVariable Long id, @Valid @RequestBody JournalEntryCreationRequest request) {
        return ApiResponse.success("Journal entry updated successfully", journalEntryService.updateJournalEntry(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJournalEntry(@PathVariable Long id) {
        journalEntryService.deleteJournalEntry(id);
    }

    /**
     * Returns the LLM extraction for a journal entry.
     *
     * Returns HTTP 200 with the extraction data if available.
     * Returns HTTP 200 with {@code result: null} if the extraction has not
     * yet been processed — this is the expected state immediately after journal
     * creation since extraction runs asynchronously in Milestone 2.
     *
     * The authenticated user must own the journal entry.
     */
    @GetMapping("/{id}/extraction")
    public ApiResponse<JournalExtractionResponse> getExtraction(@PathVariable Long id) {
        return ApiResponse.success(
                "Extraction retrieved successfully",
                extractionQueryService.getExtractionForJournal(id).orElse(null)
        );
    }
}
