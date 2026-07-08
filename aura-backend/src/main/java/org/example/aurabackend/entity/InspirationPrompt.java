package org.example.aurabackend.entity;

import java.time.LocalDateTime;

import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.Language;
import org.example.aurabackend.enumeration.PromptCategory;
import org.example.aurabackend.enumeration.PromptType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inspiration_prompts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspirationPrompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Emotion emotion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (active == null) {
            active = true;
        }

        if (displayOrder == null) {
            displayOrder = 0;
        }

        if (weight == null || weight < 1) {
            weight = 1;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
