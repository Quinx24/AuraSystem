package org.example.aurabackend.repository;

import java.time.LocalDate;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.enumeration.Emotion;
import org.springframework.data.jpa.domain.Specification;

public final class JournalEntrySpecification {

    private JournalEntrySpecification() {
    }

    public static Specification<JournalEntry> containsUsername(String username) {
        return (root, query, criteriaBuilder) -> {
            if (username == null || username.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String value = "%" + username.trim().toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.join("user").get("fullName")), value);
        };
    }

    public static Specification<JournalEntry> containsContent(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String value = "%" + keyword.trim().toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("journalContent")), value);
        };
    }

    public static Specification<JournalEntry> hasEmotion(Emotion emotion) {
        return (root, query, criteriaBuilder) -> emotion == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("primaryEmotion"), emotion);
    }

    public static Specification<JournalEntry> createdOn(LocalDate date) {
        return (root, query, criteriaBuilder) -> {
            if (date == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.between(
                    root.get("createdAt"),
                    date.atStartOfDay(),
                    date.plusDays(1).atStartOfDay());
        };
    }
}
