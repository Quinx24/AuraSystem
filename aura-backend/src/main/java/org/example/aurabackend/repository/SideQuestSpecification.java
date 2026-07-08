package org.example.aurabackend.repository;

import org.example.aurabackend.entity.SideQuest;
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
}
