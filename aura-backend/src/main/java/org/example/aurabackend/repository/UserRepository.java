package org.example.aurabackend.repository;

import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Role;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByRole(Role role);

}
