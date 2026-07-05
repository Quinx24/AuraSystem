package org.example.aurabackend.service;

import org.example.aurabackend.dto.response.LevelResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LevelService {

    private final CurrentUserService currentUserService;

    private final UserRepository userRepository;

    public LevelResponse getLevel() {

        User user = currentUserService.getCurrentUser();

        int requiredXp = user.getLevel() * 100;

        int progress = Math.min(
                (user.getXp() * 100) / requiredXp,
                100);

        return LevelResponse.builder()
                .level(user.getLevel())
                .xp(user.getXp())
                .requiredXp(requiredXp)
                .progress(progress)
                .build();
    }

    public void addXp(int amount) {

        User user = currentUserService.getCurrentUser();

        int newXp = user.getXp() + amount;

        user.setXp(newXp);

        int requiredXp = user.getLevel() * 100;

        while (user.getXp() >= requiredXp) {

            user.setXp(user.getXp() - requiredXp);

            user.setLevel(user.getLevel() + 1);

            requiredXp = user.getLevel() * 100;
        }

        userRepository.save(user);
    }
}