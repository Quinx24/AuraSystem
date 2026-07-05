package org.example.aurabackend.repository;

import org.example.aurabackend.entity.JournalEmotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalEmotionRepository extends JpaRepository<JournalEmotion, Long>{
   
}
