package org.example.aurabackend.entity;

import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "side_quests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SideQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer xpReward;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Emotion emotion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SideQuestCategory category;
}
