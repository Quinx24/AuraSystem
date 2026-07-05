package org.example.aurabackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.aurabackend.dto.request.RegisterRequest;
import org.example.aurabackend.dto.request.LoginRequest;
import org.example.aurabackend.dto.request.LogoutRequest;
import org.example.aurabackend.dto.request.RefreshTokenRequest;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.LoginResponse;
import org.example.aurabackend.dto.response.RefreshTokenResponse;
import org.example.aurabackend.service.AuthService;
import org.example.aurabackend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<Void> register(
            @RequestBody RegisterRequest request) {

        userService.register(request);

        return ApiResponse.success(
            "Register successfully",
             null
        );
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @RequestBody LoginRequest request) {
        
        LoginResponse response = authService.login(request);

        return ApiResponse.success(
            "Login successfully", 
            response
        );
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshTokenResponse> refresh(
            @RequestBody RefreshTokenRequest request) {

        return ApiResponse.success(
            "Access token refreshed successfully",
            authService.refresh(request)
        );
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @RequestBody LogoutRequest request) {

        authService.logout(request);

        return ApiResponse.success(
            "Logout successfully",
            null
        );
    }
}