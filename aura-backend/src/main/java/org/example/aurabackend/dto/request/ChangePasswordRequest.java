package org.example.aurabackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "CURRENT_PASSWORD_REQUIRED")
    private String currentPassword;

    @NotBlank(message = "NEW_PASSWORD_REQUIRED")
    private String newPassword;
}