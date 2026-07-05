package org.example.aurabackend.repository;

import java.util.List;
import java.util.Optional;

import org.example.aurabackend.entity.RefreshToken;
import org.example.aurabackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUser(User user);

}