package org.example.aurabackend.repository;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.springframework.data.jpa.domain.Specification;

public final class SideQuestSpecification {

    private SideQuestSpecification() {
    }

    public static Specification<SideQuest> hasEmotion(Emotion emotion) {
        return (root, query, criteriaBuilder) -> emotion == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("emotion"), emotion);
    }

    public static Specification<SideQuest> hasCategory(SideQuestCategory category) {
        return (root, query, criteriaBuilder) -> category == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<SideQuest> hasDifficulty(Difficulty difficulty) {
        return (root, query, criteriaBuilder) -> difficulty == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("difficulty"), difficulty);
    }

    public static Specification<SideQuest> hasPublished(Boolean published) {
        return (root, query, criteriaBuilder) -> published == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("published"), published);
    }

    public static Specification<SideQuest> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String value = "%" + keyword.trim().toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), value),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), value));
        };
    }
}
