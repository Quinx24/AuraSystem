package org.example.aurabackend.dto.request;

import org.example.aurabackend.enumeration.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminUpdateUserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is required")
    private String email;

    private String avatarUrl;

    private Role role;

    private Boolean locked;
}
