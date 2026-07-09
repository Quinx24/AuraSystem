package org.example.aurabackend.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import org.example.aurabackend.enumeration.Role;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String avatarUrl;

    private LocalDateTime createdAt;

    private Integer level;

    private Integer xp;

    private Role role;
}