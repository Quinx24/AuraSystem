package org.example.aurabackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping
    public ApiResponse<String> upload(
            @RequestParam("file") MultipartFile file) throws Exception {

        String url = fileStorageService.saveFile(file);

        return ApiResponse.success(
                "Upload successfully",
                url
        );
    }
}