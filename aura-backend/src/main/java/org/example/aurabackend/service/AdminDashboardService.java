package org.example.aurabackend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.example.aurabackend.dto.response.DashboardResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final SideQuestRepository sideQuestRepository;

    public DashboardResponse getDashboard() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();
        LocalDateTime weekStart = today.minusDays(6).atStartOfDay();

        List<JournalEntry> journals = journalEntryRepository.findAll();

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalJournals(journalEntryRepository.count())
                .totalSideQuests(sideQuestRepository.count())
                .averageMood(resolveAverageMood(journals))
                .journalsToday(journalEntryRepository.countByCreatedAtBetween(todayStart, tomorrowStart))
                .newUsersThisWeek(userRepository.countByCreatedAtBetween(weekStart, tomorrowStart))
                .newJournalsThisWeek(journalEntryRepository.countByCreatedAtBetween(weekStart, tomorrowStart))
                .topEmotion(resolveTopEmotion(journals))
                .recentActivities(resolveRecentActivities())
                .build();
    }

    private Emotion resolveTopEmotion(List<JournalEntry> journals) {
        return journals.stream()
                .filter(journal -> journal.getPrimaryEmotion() != null)
                .collect(Collectors.groupingBy(JournalEntry::getPrimaryEmotion, Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private Emotion resolveAverageMood(List<JournalEntry> journals) {
        Map<Emotion, Integer> values = Map.of(
                Emotion.SAD, 1,
                Emotion.ANXIETY, 2,
                Emotion.NEUTRAL, 3,
                Emotion.HAPPY, 4,
                Emotion.EXCITED, 5,
                Emotion.ANGRY, 6,
                Emotion.STRESS, 7);

        Map<Integer, Emotion> emotionsByValue = values.entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getValue, Map.Entry::getKey));

        double average = journals.stream()
                .filter(journal -> journal.getPrimaryEmotion() != null)
                .map(JournalEntry::getPrimaryEmotion)
                .map(values::get)
                .filter(value -> value != null)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0);

        if (average == 0) {
            return null;
        }

        return emotionsByValue.getOrDefault((int) Math.round(average), Emotion.NEUTRAL);
    }

    private List<DashboardResponse.RecentActivity> resolveRecentActivities() {
        List<DashboardResponse.RecentActivity> userActivities = userRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::mapUserActivity)
                .toList();

        List<DashboardResponse.RecentActivity> journalActivities = journalEntryRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::mapJournalActivity)
                .toList();

        return Stream.concat(userActivities.stream(), journalActivities.stream())
                .sorted(Comparator.comparing(DashboardResponse.RecentActivity::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .toList();
    }

    private DashboardResponse.RecentActivity mapUserActivity(User user) {
        return DashboardResponse.RecentActivity.builder()
                .type("USER")
                .title("New user")
                .description(user.getFullName() + " joined Aura")
                .createdAt(user.getCreatedAt())
                .build();
    }

    private DashboardResponse.RecentActivity mapJournalActivity(JournalEntry journal) {
        String userName = journal.getUser() == null ? "A user" : journal.getUser().getFullName();
        return DashboardResponse.RecentActivity.builder()
                .type("JOURNAL")
                .title("New journal")
                .description(userName + " created a journal entry")
                .createdAt(journal.getCreatedAt())
                .build();
    }
}
