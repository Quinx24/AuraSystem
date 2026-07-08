package org.example.aurabackend.repository;

import java.util.List;
import java.util.Optional;

import org.example.aurabackend.entity.InspirationPrompt;
import org.example.aurabackend.enumeration.Difficulty;
import org.example.aurabackend.enumeration.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspirationPromptRepository extends JpaRepository<InspirationPrompt, Long> {

    List<InspirationPrompt> findAllByActiveTrueOrderByDisplayOrderAsc();

    List<InspirationPrompt> findByEmotionAndActiveTrueOrderByDisplayOrderAsc(Emotion emotion);

    Optional<InspirationPrompt> findByIdAndActiveTrue(Long id);

    List<InspirationPrompt> findByEmotionAndDifficultyAndActiveTrueOrderByDisplayOrderAsc(
            Emotion emotion,
            Difficulty difficulty);
}
