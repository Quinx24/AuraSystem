package org.example.aurabackend.controller;

import org.example.aurabackend.dto.request.TagCreationRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.TagResponse;
import org.example.aurabackend.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TagResponse> createTag(@Valid @RequestBody TagCreationRequest request) {

        return ApiResponse.success("Tag created successfully", tagService.createTag(request.getName()));
    }

    @GetMapping("/{id}")
    public ApiResponse<TagResponse> getTagById(@PathVariable Long id) {
        return ApiResponse.success("Tag retrieved successfully", tagService.getTagById(id));
    }

    @GetMapping
    public ApiResponse<List<TagResponse>> getAllTags() {
        return ApiResponse.success("All tags retrieved successfully", tagService.getAllTags());
    }

    @PutMapping("/{id}")
    public ApiResponse<TagResponse> updateTag(@PathVariable Long id, @Valid @RequestBody TagCreationRequest request) {
        return ApiResponse.success("Tag updated successfully", tagService.updateTag(id, request.getName()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
    }
}
