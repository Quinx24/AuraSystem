package org.example.aurabackend.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import org.example.aurabackend.dto.response.SideQuestResponse;
import org.example.aurabackend.dto.response.UserSideQuestResponse;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.SideQuestSpecification;
import org.example.aurabackend.repository.UserSideQuestRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SideQuestService {
    private final SideQuestRepository sideQuestRepository;
    private final UserSideQuestRepository userSideQuestRepository;
    private final LevelService levelService;

    private SideQuestResponse mapToResponse(SideQuest sideQuest) {
        return SideQuestResponse.builder()
                .id(sideQuest.getId())
                .title(sideQuest.getTitle())
                .description(sideQuest.getDescription())
                .xpReward(sideQuest.getXpReward())
                .emotion(sideQuest.getEmotion())
                .category(sideQuest.getCategory())
                .build();
    }

    public List<SideQuestResponse> getByEmotion(Emotion emotion) {

        List<SideQuest> sideQuests = sideQuestRepository.findByEmotion(emotion);

        Collections.shuffle(sideQuests);

        return sideQuests.stream()
                .filter(sideQuest -> !Boolean.FALSE.equals(sideQuest.getPublished()))
                .limit(3)
                .map(this::mapToResponse)
                .toList();
    }

    public List<SideQuestResponse> getAll() {

        return sideQuestRepository.findAll()
                .stream()
                .filter(sideQuest -> !Boolean.FALSE.equals(sideQuest.getPublished()))
                .map(this::mapToResponse)
                .toList();
    }

    public List<SideQuestResponse> getAll(String mood, String category, String sort) {

        Emotion emotionFilter = parseEnum(mood, Emotion.class);
        SideQuestCategory categoryFilter = parseEnum(category, SideQuestCategory.class);

        Specification<SideQuest> specification = Specification
                .where(SideQuestSpecification.hasEmotion(emotionFilter))
                .and(SideQuestSpecification.hasCategory(categoryFilter));

        return sideQuestRepository.findAll(specification, resolveSort(sort))
                .stream()
                .filter(sideQuest -> !Boolean.FALSE.equals(sideQuest.getPublished()))
                .map(this::mapToResponse)
                .toList();
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        return switch (sort.toLowerCase(Locale.ROOT)) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "id");
            case "xp_desc" -> Sort.by(Sort.Direction.DESC, "xpReward");
            case "xp_asc" -> Sort.by(Sort.Direction.ASC, "xpReward");
            case "az", "title_asc" -> Sort.by(Sort.Direction.ASC, "title");
            default -> Sort.by(Sort.Direction.DESC, "id");
        };
    }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumClass) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalizedValue = value
                .trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase(Locale.ROOT);

        try {
            return Enum.valueOf(enumClass, normalizedValue);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    public List<UserSideQuestResponse> getTodayQuest(User user) {

        return userSideQuestRepository
                .findByUserAndAssignedDateAndCompleted(
                        user,
                        LocalDate.now(),
                        false)
                .stream()
                .map(userQuest -> UserSideQuestResponse.builder()
                        .id(userQuest.getId())
                        .sideQuestId(userQuest.getSideQuest().getId())
                        .title(userQuest.getSideQuest().getTitle())
                        .description(userQuest.getSideQuest().getDescription())
                        .xpReward(userQuest.getSideQuest().getXpReward())
                        .category(userQuest.getSideQuest().getCategory())
                        .completed(userQuest.getCompleted())
                        .assignedDate(userQuest.getAssignedDate())
                        .completedDate(userQuest.getCompletedDate())
                        .build())
                .toList();
    }

    public List<UserSideQuestResponse> getCompletedQuest(User user) {

        return userSideQuestRepository
                .findByUserAndCompleted(
                        user,
                        true)
                .stream()
                .map(userQuest -> UserSideQuestResponse.builder()
                        .id(userQuest.getId())
                        .sideQuestId(userQuest.getSideQuest().getId())
                        .title(userQuest.getSideQuest().getTitle())
                        .description(userQuest.getSideQuest().getDescription())
                        .xpReward(userQuest.getSideQuest().getXpReward())
                        .category(userQuest.getSideQuest().getCategory())
                        .completed(userQuest.getCompleted())
                        .assignedDate(userQuest.getAssignedDate())
                        .completedDate(userQuest.getCompletedDate())
                        .build())
                .toList();
    }

    public void addQuest(User user, Long sideQuestId) {
        SideQuest sideQuest = sideQuestRepository.findById(sideQuestId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.SIDE_QUEST_NOT_EXISTED));

        boolean existed = userSideQuestRepository
                .existsByUserAndSideQuestAndCompleted(user, sideQuest, false);

        if (existed) {
            throw new AppException(
                    ErrorCode.SIDE_QUEST_ALREADY_ADDED);
        }

        UserSideQuest userSideQuest = UserSideQuest.builder()
                .user(user)
                .sideQuest(sideQuest)
                .completed(false)
                .assignedDate(LocalDate.now())
                .build();

        userSideQuestRepository.save(userSideQuest);
    }

    public void removeQuest(User user, Long sideQuestId) {
        SideQuest sideQuest = sideQuestRepository.findById(sideQuestId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.SIDE_QUEST_NOT_EXISTED));

        UserSideQuest userSideQuest = userSideQuestRepository
                .findByUserAndSideQuestAndCompleted(user, sideQuest, false)
                .orElseThrow(() -> new AppException(
                        ErrorCode.USER_SIDE_QUEST_NOT_EXISTED));

        userSideQuestRepository.delete(userSideQuest);
    }

    public void completeQuest(User user, Long userSideQuestId) {
        UserSideQuest userSideQuest = userSideQuestRepository
                .findById(userSideQuestId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.USER_SIDE_QUEST_NOT_EXISTED));

        if (!userSideQuest.getUser().getId().equals(user.getId())) {
            throw new AppException(
                    ErrorCode.UNAUTHORIZED);
        }

        if (userSideQuest.getCompleted()) {
            throw new AppException(
                    ErrorCode.USER_SIDE_QUEST_ALREADY_COMPLETED);
        }

        userSideQuest.setCompleted(true);
        userSideQuest.setCompletedDate(LocalDate.now());

        userSideQuestRepository.save(userSideQuest);

        levelService.addXp(
                userSideQuest.getSideQuest().getXpReward());
    }
}
