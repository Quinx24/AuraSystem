package org.example.aurabackend.controller;

import org.example.aurabackend.dto.request.AdminUpdateUserRequest;
import org.example.aurabackend.dto.response.AdminUserResponse;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.enumeration.Role;
import org.example.aurabackend.service.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<Page<AdminUserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean locked,
            @RequestParam(required = false) String sort) {

        return ApiResponse.success(
                "Admin users retrieved successfully",
                adminUserService.getUsers(page, size, search, role, locked, sort));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminUserResponse> getById(@PathVariable Long id) {
        return ApiResponse.success("Admin user retrieved successfully", adminUserService.getById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminUserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {

        return ApiResponse.success("Admin user updated successfully", adminUserService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminUserService.delete(id);
        return ApiResponse.success("Admin user deleted successfully", null);
    }

    @PatchMapping("/{id}/lock")
    public ApiResponse<AdminUserResponse> lock(@PathVariable Long id) {
        return ApiResponse.success("Admin user locked successfully", adminUserService.lock(id));
    }

    @PatchMapping("/{id}/unlock")
    public ApiResponse<AdminUserResponse> unlock(@PathVariable Long id) {
        return ApiResponse.success("Admin user unlocked successfully", adminUserService.unlock(id));
    }
}
