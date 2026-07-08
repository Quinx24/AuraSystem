package org.example.aurabackend.service;

import java.util.List;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.example.aurabackend.dto.request.InspirationPromptCreationRequest;
import org.example.aurabackend.dto.request.InspirationPromptUpdateRequest;
import org.example.aurabackend.dto.response.InspirationPromptResponse;
import org.example.aurabackend.entity.InspirationPrompt;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.PromptCategory;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.InspirationPromptRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InspirationPromptService {

    private final InspirationPromptRepository inspirationPromptRepository;

    private InspirationPromptResponse mapToResponse(InspirationPrompt prompt) {
        return InspirationPromptResponse.builder()
                .id(prompt.getId())
                .title(prompt.getTitle())
                .description(prompt.getDescription())
                .emotion(prompt.getEmotion())
                .category(prompt.getCategory())
                .type(prompt.getType())
                .difficulty(prompt.getDifficulty())
                .language(prompt.getLanguage())
                .build();
    }

    public InspirationPromptResponse create(InspirationPromptCreationRequest request) {
        InspirationPrompt prompt = InspirationPrompt.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .emotion(request.getEmotion())
                .category(request.getCategory())
                .type(request.getType())
                .language(request.getLanguage())
                .difficulty(request.getDifficulty())
                .weight(request.getWeight() == null ? 1 : request.getWeight())
                .active(request.getActive() == null ? true : request.getActive())
                .displayOrder(request.getDisplayOrder() == null ? 0 : request.getDisplayOrder())
                .build();

        return mapToResponse(inspirationPromptRepository.save(prompt));
    }

    public InspirationPromptResponse update(Long id, InspirationPromptUpdateRequest request) {
        InspirationPrompt prompt = getEntityById(id);

        prompt.setTitle(request.getTitle().trim());
        prompt.setDescription(request.getDescription().trim());
        prompt.setEmotion(request.getEmotion());
        prompt.setCategory(request.getCategory());
        prompt.setType(request.getType());
        prompt.setLanguage(request.getLanguage());
        prompt.setDifficulty(request.getDifficulty());
        prompt.setWeight(request.getWeight() == null ? prompt.getWeight() : request.getWeight());
        prompt.setActive(request.getActive() == null ? prompt.getActive() : request.getActive());
        prompt.setDisplayOrder(request.getDisplayOrder() == null ? prompt.getDisplayOrder() : request.getDisplayOrder());

        return mapToResponse(inspirationPromptRepository.save(prompt));
    }

    public InspirationPromptResponse getById(Long id) {
        return mapToResponse(getEntityById(id));
    }

    public List<InspirationPromptResponse> getAll() {
        return inspirationPromptRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<InspirationPromptResponse> getAllActive() {
        return inspirationPromptRepository.findAllByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public InspirationPromptResponse getRandom(Long previousPromptId) {
        return mapToResponse(getWeightedRandom(
                inspirationPromptRepository.findAllByActiveTrueOrderByDisplayOrderAsc(),
                previousPromptId));
    }

    public InspirationPromptResponse getRandomByEmotion(Emotion emotion, Long previousPromptId) {
        return mapToResponse(getWeightedRandom(
                inspirationPromptRepository.findByEmotionAndActiveTrueOrderByDisplayOrderAsc(emotion),
                previousPromptId));
    }

    public InspirationPromptResponse getRandomByEmotionAndDifficulty(
            Emotion emotion,
            Difficulty difficulty,
            Long previousPromptId) {

        return mapToResponse(getWeightedRandom(
                inspirationPromptRepository.findByEmotionAndDifficultyAndActiveTrueOrderByDisplayOrderAsc(
                        emotion,
                        difficulty),
                previousPromptId));
    }

    public List<InspirationPromptResponse> getRandomList(Integer limit) {
        return getRandomListFromPrompts(
                inspirationPromptRepository.findAllByActiveTrueOrderByDisplayOrderAsc(),
                limit);
    }

    public List<InspirationPromptResponse> getRandomListByEmotion(Emotion emotion, Integer limit) {
        return getRandomListFromPrompts(
                inspirationPromptRepository.findByEmotionAndActiveTrueOrderByDisplayOrderAsc(emotion),
                limit);
    }

    public InspirationPromptResponse enable(Long id) {
        InspirationPrompt prompt = getEntityById(id);
        prompt.setActive(true);
        return mapToResponse(inspirationPromptRepository.save(prompt));
    }

    public InspirationPromptResponse disable(Long id) {
        InspirationPrompt prompt = getEntityById(id);
        prompt.setActive(false);
        return mapToResponse(inspirationPromptRepository.save(prompt));
    }

    public void delete(Long id) {
        InspirationPrompt prompt = getEntityById(id);
        prompt.setActive(false);
        inspirationPromptRepository.save(prompt);
    }

    private InspirationPrompt getEntityById(Long id) {
        return inspirationPromptRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INSPIRATION_PROMPT_NOT_FOUND));
    }

    private List<InspirationPromptResponse> getRandomListFromPrompts(
            List<InspirationPrompt> prompts,
            Integer limit) {

        if (prompts.isEmpty()) {
            throw new AppException(ErrorCode.INSPIRATION_PROMPT_NOT_FOUND);
        }

        int safeLimit = limit == null || limit < 1 ? 3 : limit;
        Map<PromptCategory, List<InspirationPrompt>> promptsByCategory = prompts.stream()
                .collect(Collectors.groupingBy(InspirationPrompt::getCategory));

        List<InspirationPrompt> selectedPrompts = promptsByCategory.values()
                .stream()
                .map(this::getWeightedRandomFromCategory)
                .collect(Collectors.toList());

        Collections.shuffle(selectedPrompts);

        return selectedPrompts.stream()
                .limit(safeLimit)
                .map(this::mapToResponse)
                .toList();
    }

    private InspirationPrompt getWeightedRandomFromCategory(List<InspirationPrompt> prompts) {
        return getWeightedRandom(prompts, null);
    }

    private InspirationPrompt getWeightedRandom(List<InspirationPrompt> prompts, Long previousPromptId) {
        if (prompts.isEmpty()) {
            throw new AppException(ErrorCode.INSPIRATION_PROMPT_NOT_FOUND);
        }

        List<InspirationPrompt> candidates = excludePreviousPrompt(prompts, previousPromptId);

        if (candidates.isEmpty()) {
            candidates = prompts;
        }

        int totalWeight = candidates.stream()
                .mapToInt(this::getSafeWeight)
                .sum();

        int randomWeight = ThreadLocalRandom.current().nextInt(totalWeight) + 1;
        int accumulatedWeight = 0;

        /*
         * Weighted random:
         * Each prompt owns a range proportional to its weight inside totalWeight.
         * A prompt with weight 100 receives a much larger range than one with weight 5,
         * so it has a higher chance to be selected while still allowing variety.
         */
        for (InspirationPrompt prompt : candidates) {
            accumulatedWeight += getSafeWeight(prompt);

            if (randomWeight <= accumulatedWeight) {
                return prompt;
            }
        }

        return candidates.get(candidates.size() - 1);
    }

    private List<InspirationPrompt> excludePreviousPrompt(
            List<InspirationPrompt> prompts,
            Long previousPromptId) {

        if (previousPromptId == null || prompts.size() == 1) {
            return prompts;
        }

        return prompts.stream()
                .filter(prompt -> !prompt.getId().equals(previousPromptId))
                .toList();
    }

    private int getSafeWeight(InspirationPrompt prompt) {
        return prompt.getWeight() == null || prompt.getWeight() < 1
                ? 1
                : prompt.getWeight();
    }
}
