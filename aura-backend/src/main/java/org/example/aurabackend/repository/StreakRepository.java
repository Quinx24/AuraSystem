package org.example.aurabackend.repository;

import java.util.Optional;

import org.example.aurabackend.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    
    Optional<Streak> findByUserId(Long userId);
    
}
