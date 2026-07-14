package org.example.aurabackend.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.example.aurabackend.dto.response.StatisticsResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.UserRepository;
import org.example.aurabackend.repository.UserSideQuestRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminStatisticsService {

    private final UserRepository userRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final UserSideQuestRepository userSideQuestRepository;

    public StatisticsResponse getStatistics() {
        List<User> users = userRepository.findAll();
        List<JournalEntry> journals = journalEntryRepository.findAll();
        List<StatisticsResponse.EmotionCount> emotionDistribution = resolveEmotionDistribution(journals);

        return StatisticsResponse.builder()
                .usersByMonth(groupUsersByMonth(users))
                .journalsByMonth(groupJournalsByMonth(journals))
                .emotionDistribution(emotionDistribution)
                .topEmotion(resolveTopEmotion(emotionDistribution))
                .journalsByDay(groupJournalsByDay(journals))
                .activeUsers(countActiveUsers(journals))
                .completedQuests(userSideQuestRepository.countByCompleted(true))
                .build();
    }

    private List<StatisticsResponse.TimeSeriesPoint> groupUsersByMonth(List<User> users) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<YearMonth, Long> grouped = users.stream()
                .filter(user -> user.getCreatedAt() != null)
                .collect(Collectors.groupingBy(user -> YearMonth.from(user.getCreatedAt()), Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> StatisticsResponse.TimeSeriesPoint.builder()
                        .label(entry.getKey().format(formatter))
                        .count(entry.getValue())
                        .build())
                .toList();
    }

    private List<StatisticsResponse.TimeSeriesPoint> groupJournalsByMonth(List<JournalEntry> journals) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<YearMonth, Long> grouped = journals.stream()
                .filter(journal -> journal.getCreatedAt() != null)
                .collect(Collectors.groupingBy(journal -> YearMonth.from(journal.getCreatedAt()), Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> StatisticsResponse.TimeSeriesPoint.builder()
                        .label(entry.getKey().format(formatter))
                        .count(entry.getValue())
                        .build())
                .toList();
    }

    private List<StatisticsResponse.TimeSeriesPoint> groupJournalsByDay(List<JournalEntry> journals) {
        Map<LocalDate, Long> grouped = journals.stream()
                .filter(journal -> journal.getCreatedAt() != null)
                .collect(Collectors.groupingBy(journal -> journal.getCreatedAt().toLocalDate(), Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> StatisticsResponse.TimeSeriesPoint.builder()
                        .label(entry.getKey().toString())
                        .count(entry.getValue())
                        .build())
                .toList();
    }

    private List<StatisticsResponse.EmotionCount> resolveEmotionDistribution(List<JournalEntry> journals) {
        Map<Emotion, Long> grouped = journals.stream()
                .filter(journal -> journal.getPrimaryEmotion() != null)
                .collect(Collectors.groupingBy(JournalEntry::getPrimaryEmotion, Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted((left, right) -> Long.compare(right.getValue(), left.getValue()))
                .map(entry -> StatisticsResponse.EmotionCount.builder()
                        .emotion(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .toList();
    }

    private Emotion resolveTopEmotion(List<StatisticsResponse.EmotionCount> emotionDistribution) {
        return emotionDistribution.stream()
                .findFirst()
                .map(StatisticsResponse.EmotionCount::getEmotion)
                .orElse(null);
    }

    private long countActiveUsers(List<JournalEntry> journals) {
        LocalDate cutoff = LocalDate.now().minusDays(30);

        return journals.stream()
                .filter(journal -> journal.getCreatedAt() != null)
                .filter(journal -> !journal.getCreatedAt().toLocalDate().isBefore(cutoff))
                .filter(journal -> journal.getUser() != null)
                .map(journal -> journal.getUser().getId())
                .distinct()
                .count();
    }
}
