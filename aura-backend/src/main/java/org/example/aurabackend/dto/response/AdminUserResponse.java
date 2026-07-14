package org.example.aurabackend.dto.response;

import java.time.LocalDateTime;

import org.example.aurabackend.enumeration.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String avatarUrl;

    private Role role;

    private Boolean locked;

    private Integer level;

    private Integer xp;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
