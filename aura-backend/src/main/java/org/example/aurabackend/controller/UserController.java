package org.example.aurabackend.controller;

import org.example.aurabackend.dto.request.ChangePasswordRequest;
import org.example.aurabackend.dto.request.UserUpdateRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.UserResponse;
import org.example.aurabackend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
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
                userService.getCurrentUser());
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateCurrentUser(
            @RequestBody @Valid UserUpdateRequest request) {

        return ApiResponse.success(
                "Profile updated successfully",
                userService.updateCurrentUser(request));
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @RequestBody @Valid ChangePasswordRequest request) {

        userService.changePassword(request);

        return ApiResponse.success(
                "Password changed successfully",
                null);
    }
}
