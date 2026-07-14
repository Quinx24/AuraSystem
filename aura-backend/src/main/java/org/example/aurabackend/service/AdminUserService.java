package org.example.aurabackend.service;

import org.example.aurabackend.dto.request.AdminUpdateUserRequest;
import org.example.aurabackend.dto.response.AdminUserResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Role;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.UserRepository;
import org.example.aurabackend.repository.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public Page<AdminUserResponse> getUsers(
            int page,
            int size,
            String search,
            Role role,
            Boolean locked,
            String sort) {

        Specification<User> specification = Specification
                .where(UserSpecification.containsKeyword(search))
                .and(UserSpecification.hasRole(role))
                .and(UserSpecification.hasLocked(locked));

        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));

        return userRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    public AdminUserResponse getById(Long id) {
        return mapToResponse(findUser(id));
    }

    @Transactional
    public AdminUserResponse update(Long id, AdminUpdateUserRequest request) {
        User user = findUser(id);

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setAvatarUrl(request.getAvatarUrl());

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getLocked() != null) {
            user.setLocked(request.getLocked());
        }

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findUser(id);
        user.setLocked(true);
        userRepository.save(user);
    }

    @Transactional
    public AdminUserResponse lock(Long id) {
        User user = findUser(id);
        user.setLocked(true);
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse unlock(Long id) {
        User user = findUser(id);
        user.setLocked(false);
        return mapToResponse(userRepository.save(user));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private AdminUserResponse mapToResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .locked(Boolean.TRUE.equals(user.getLocked()))
                .level(user.getLevel())
                .xp(user.getXp())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] parts = sort.split(",");
        String property = parts[0].isBlank() ? "createdAt" : parts[0];
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, property);
    }
}
