package org.example.aurabackend.service;

import org.example.aurabackend.config.JwtProperties;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.example.aurabackend.entity.User;
import lombok.RequiredArgsConstructor;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jws;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                jwtProperties
                        .getSignerKey()
                        .getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Date now = new Date();

        Date expiration = new Date(
                now.getTime()
                        + jwtProperties.getValidDuration() * 1000);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole() != null ? user.getRole().name() : "USER")
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();

        Date expiration = new Date(
                now.getTime()
                        + jwtProperties.getRefreshDuration() * 1000);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        Jws<Claims> claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);

        return claims.getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Claims claims = extractClaims(token);
        String role = claims.get("role", String.class);
        return role != null ? role : "USER";
    }

    public boolean isTokenValid(String token) {
        try {

            extractClaims(token);

            return true;

        } catch (JwtException e) {

            return false;

        }
    }
}
