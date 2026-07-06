package org.example.aurabackend.service;

import org.example.aurabackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import org.example.aurabackend.dto.request.ChangePasswordRequest;
import org.example.aurabackend.dto.request.RegisterRequest;
import org.example.aurabackend.dto.request.UserUpdateRequest;
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

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .level(user.getLevel())
                .xp(user.getXp())
                .build();
    }

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
        return mapToResponse(currentUserService.getCurrentUser());
    }

    public UserResponse updateCurrentUser(UserUpdateRequest request) {

        User user = currentUserService.getCurrentUser();

        user.setFullName(request.getFullName());
        user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);

        return mapToResponse(user);
    }

    public void changePassword(ChangePasswordRequest request) {

        User user = currentUserService.getCurrentUser();

        System.out.println("===== CHANGE PASSWORD =====");
        System.out.println("Request current password: " + request.getCurrentPassword());

        boolean matched = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword());

        System.out.println("Matched: " + matched);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new AppException(
                    ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT);
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}
