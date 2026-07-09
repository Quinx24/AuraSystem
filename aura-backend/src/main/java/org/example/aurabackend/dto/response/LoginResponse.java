package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.aurabackend.enumeration.Role;

@Data
@Builder
public class LoginResponse {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private String accessToken;

    private String refreshToken;
}
