package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.UserResponse;
import org.example.aurabackend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        
        return ApiResponse.success(
            "User profile retrieved successfully",
            userService.getCurrentUser()
        );
    }
}
