package org.example.aurabackend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository //Dùng để đánh dấu đây là một Repository, giúp Spring quản lý và tạo bean cho nó
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> { //Kế thừa JpaRepository để có các phương thức CRUD cơ bản cho JournalEntry
    
    List<JournalEntry> findByUser(User user);

    Page<JournalEntry> findByUser(User user, Pageable pageable);
    
    Optional<JournalEntry> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUser(Long id, User user);
}
