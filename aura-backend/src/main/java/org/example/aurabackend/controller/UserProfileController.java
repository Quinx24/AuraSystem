package org.example.aurabackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.service.ExtractionQueryService;
import org.example.aurabackend.service.UserProfileService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for user profile and extraction history endpoints.
 *
 * Endpoints:
 *   - GET /users/me/profile - Returns the user's preference profile
 *   - GET /users/me/extractions - Returns paginated extraction history
 *
 * All endpoints are scoped to the authenticated user only.
 * Ownership validation is handled by the service layer.
 */
@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final ExtractionQueryService extractionQueryService;

    /**
     * Returns the preference profile for the authenticated user.
     *
     * Returns HTTP 200 with the profile data if available.
     * Returns HTTP 200 with {@code result: null} if no profile exists yet
     * (cold start, no extractions processed).
     */
    @GetMapping("/profile")
    public ApiResponse<UserPreferenceProfileResponse> getProfile() {
        return ApiResponse.success(
                "Profile retrieved successfully",
                userProfileService.getCurrentUserProfile().orElse(null)
        );
    }

    /**
     * Returns a paginated list of extraction summaries for the authenticated user,
     * ordered newest first.
     *
     * @param page zero-based page index (default 0)
     * @param size number of records per page (default 10, max 50)
     */
    @GetMapping("/extractions")
    public ApiResponse<Page<ExtractionSummaryResponse>> getExtractions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.success(
                "Extraction history retrieved successfully",
                extractionQueryService.getExtractionHistory(page, size)
        );
    }
}
