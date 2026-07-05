package org.example.aurabackend.service;

import org.example.aurabackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.example.aurabackend.dto.request.RegisterRequest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.example.aurabackend.dto.response.UserResponse;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    public UserResponse getCurrentUser() {
        
        User user = currentUserService.getCurrentUser();

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
