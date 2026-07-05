package org.example.aurabackend.service;

import java.time.LocalDate;

import org.example.aurabackend.dto.response.StreakResponse;
import org.example.aurabackend.entity.Streak;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.repository.StreakRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreakService {

        private final StreakRepository streakRepository;

        private final CurrentUserService currentUserService;

        private StreakResponse mapToResponse(Streak streak) {
                return StreakResponse.builder()
                        .currentStreak(streak.getCurrentStreak())
                        .longestStreak(streak.getLongestStreak())
                        .totalCheckIn(streak.getTotalCheckIn())
                        .lastCheckIn(streak.getLastCheckIn())
                        .build();
        }

        public StreakResponse getStreak() {

                User user = currentUserService.getCurrentUser();

                Streak streak = streakRepository.findByUserId(user.getId())
                                .orElse(null);

                if (streak == null) {
                        return StreakResponse.builder()
                                .currentStreak(0)
                                .longestStreak(0)
                                .totalCheckIn(0)
                                .build();
                }

                return mapToResponse(streak);
        }

        public void updateStreak() {

                LocalDate today = LocalDate.now();

                User user = currentUserService.getCurrentUser();

                Streak streak = streakRepository.findByUserId(user.getId())
                                .orElse(null);

                if (streak == null) {
                        streak = Streak.builder()
                                        .user(user)
                                        .currentStreak(1)
                                        .longestStreak(1)
                                        .totalCheckIn(1)
                                        .lastCheckIn(today)
                                        .build();

                        streakRepository.save(streak);

                        return;
                }

                if (streak.getLastCheckIn().equals(today)) {
                        return;
                }

                LocalDate yesterday = today.minusDays(1);

                if (streak.getLastCheckIn().equals(yesterday)) {

                        int currentStreak = streak.getCurrentStreak() + 1;

                        streak.setCurrentStreak(currentStreak);

                        streak.setLongestStreak(
                                        Math.max(streak.getLongestStreak(), currentStreak));

                        streak.setTotalCheckIn(
                                        streak.getTotalCheckIn() + 1);

                        streak.setLastCheckIn(today);

                } else {
                        streak.setCurrentStreak(1);

                        streak.setTotalCheckIn(
                                        streak.getTotalCheckIn() + 1);

                        streak.setLastCheckIn(today);
                }

                streakRepository.save(streak);
        }
}
