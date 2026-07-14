package org.example.aurabackend.service;

import org.example.aurabackend.dto.request.AdminSideQuestRequest;
import org.example.aurabackend.dto.response.AdminSideQuestResponse;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.SideQuestSpecification;
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
public class AdminSideQuestService {

    private final SideQuestRepository sideQuestRepository;

    public Page<AdminSideQuestResponse> getSideQuests(
            int page,
            int size,
            String search,
            Emotion emotion,
            Difficulty difficulty,
            SideQuestCategory category,
            Boolean published,
            String sort) {

        Specification<SideQuest> specification = Specification
                .where(SideQuestSpecification.containsKeyword(search))
                .and(SideQuestSpecification.hasEmotion(emotion))
                .and(SideQuestSpecification.hasDifficulty(difficulty))
                .and(SideQuestSpecification.hasCategory(category))
                .and(SideQuestSpecification.hasPublished(published));

        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));

        return sideQuestRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    public AdminSideQuestResponse getById(Long id) {
        return mapToResponse(findSideQuest(id));
    }

    @Transactional
    public AdminSideQuestResponse create(AdminSideQuestRequest request) {
        SideQuest sideQuest = SideQuest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .xpReward(request.getXpReward())
                .emotion(request.getEmotion())
                .category(request.getCategory())
                .difficulty(request.getDifficulty() == null ? Difficulty.EASY : request.getDifficulty())
                .published(request.getPublished() == null || request.getPublished())
                .build();

        return mapToResponse(sideQuestRepository.save(sideQuest));
    }

    @Transactional
    public AdminSideQuestResponse update(Long id, AdminSideQuestRequest request) {
        SideQuest sideQuest = findSideQuest(id);

        sideQuest.setTitle(request.getTitle());
        sideQuest.setDescription(request.getDescription());
        sideQuest.setXpReward(request.getXpReward());
        sideQuest.setEmotion(request.getEmotion());
        sideQuest.setCategory(request.getCategory());
        sideQuest.setDifficulty(request.getDifficulty() == null ? Difficulty.EASY : request.getDifficulty());

        if (request.getPublished() != null) {
            sideQuest.setPublished(request.getPublished());
        }

        return mapToResponse(sideQuestRepository.save(sideQuest));
    }

    @Transactional
    public void delete(Long id) {
        SideQuest sideQuest = findSideQuest(id);
        sideQuest.setPublished(false);
        sideQuestRepository.save(sideQuest);
    }

    @Transactional
    public AdminSideQuestResponse publish(Long id) {
        SideQuest sideQuest = findSideQuest(id);
        sideQuest.setPublished(true);
        return mapToResponse(sideQuestRepository.save(sideQuest));
    }

    @Transactional
    public AdminSideQuestResponse unpublish(Long id) {
        SideQuest sideQuest = findSideQuest(id);
        sideQuest.setPublished(false);
        return mapToResponse(sideQuestRepository.save(sideQuest));
    }

    private SideQuest findSideQuest(Long id) {
        return sideQuestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SIDE_QUEST_NOT_EXISTED));
    }

    private AdminSideQuestResponse mapToResponse(SideQuest sideQuest) {
        return AdminSideQuestResponse.builder()
                .id(sideQuest.getId())
                .title(sideQuest.getTitle())
                .description(sideQuest.getDescription())
                .xpReward(sideQuest.getXpReward())
                .emotion(sideQuest.getEmotion())
                .category(sideQuest.getCategory())
                .difficulty(sideQuest.getDifficulty() == null ? Difficulty.EASY : sideQuest.getDifficulty())
                .published(!Boolean.FALSE.equals(sideQuest.getPublished()))
                .build();
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        String[] parts = sort.split(",");
        String property = parts[0].isBlank() ? "id" : parts[0];
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, property);
    }
}
