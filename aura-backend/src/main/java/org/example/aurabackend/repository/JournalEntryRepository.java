package org.example.aurabackend.repository;

import java.util.List;
import java.util.Optional;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long>, JpaSpecificationExecutor<JournalEntry> {

    List<JournalEntry> findByUser(User user);

    Page<JournalEntry> findByUser(User user, Pageable pageable);

    Optional<JournalEntry> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUser(Long id, User user);

    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
