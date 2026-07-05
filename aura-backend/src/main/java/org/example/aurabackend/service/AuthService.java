package org.example.aurabackend.service;

import java.time.LocalDateTime;

import org.example.aurabackend.config.JwtProperties;
import org.example.aurabackend.dto.request.LoginRequest;
import org.example.aurabackend.dto.request.LogoutRequest;
import org.example.aurabackend.dto.request.RefreshTokenRequest;
import org.example.aurabackend.dto.response.LoginResponse;
import org.example.aurabackend.dto.response.RefreshTokenResponse;
import org.example.aurabackend.entity.RefreshToken;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.RefreshTokenRepository;
import org.example.aurabackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtService.generateAccessToken(user);

        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .expiryDate(
                        LocalDateTime.now()
                                .plusSeconds(jwtProperties.getRefreshDuration()))
                .revoked(false)
                .user(user)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return LoginResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        if (refreshToken.isRevoked()) {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        User user = refreshToken.getUser();

        String accessToken = jwtService.generateAccessToken(user);

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    public void logout(LogoutRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (!jwtService.isTokenValid(request.getRefreshToken())) {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.isRevoked()) {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }
}
