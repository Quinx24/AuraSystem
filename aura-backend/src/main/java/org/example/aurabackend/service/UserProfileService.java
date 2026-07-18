package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.mapper.UserPreferenceProfileMapper;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Read-only service for user preference profile data.
 *
 * Responsibilities:
 *   - Retrieve the preference profile for the authenticated user
 *   - Return an empty Optional if no profile exists yet (cold start)
 *
 * Profile recomputation (the write side) will be implemented in
 * UserPreferenceProfileService (Milestone 2) and is entirely separate.
 *
 * Service Rule: No repository access from controllers.
 *   Controllers → UserProfileService → UserPreferenceProfileRepository
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserPreferenceProfileRepository userPreferenceProfileRepository;
    private final CurrentUserService currentUserService;

    /**
     * Returns the preference profile for the authenticated user.
     *
     * Returns {@code Optional.empty()} if no profile exists yet — this is the
     * expected state for new users before any journal extractions have been
     * processed. The controller must handle this by returning an empty profile
     * object (not a 404), so the frontend can show a "no data yet" state.
     */
    public Optional<UserPreferenceProfileResponse> getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();

        return userPreferenceProfileRepository
                .findByUser(user)
                .map(UserPreferenceProfileMapper::toResponse);
    }
}
