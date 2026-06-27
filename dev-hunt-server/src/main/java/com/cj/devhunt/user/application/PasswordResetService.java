package com.cj.devhunt.user.application;

import com.cj.devhunt.auth.domain.PasswordResetToken;
import com.cj.devhunt.auth.infrastructure.PasswordResetTokenRepository;
import com.cj.devhunt.common.exception.BusinessException;
import com.cj.devhunt.common.exception.ErrorCode;
import com.cj.devhunt.notification.application.PasswordResetMailService;
import com.cj.devhunt.user.domain.User;
import com.cj.devhunt.user.infrastructure.UserRepository;
import com.cj.devhunt.user.presentation.dto.PasswordResetResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetMailService mailService;

    @Value("${app.front-url}")
    private String frontUrl;

    @Transactional
    public PasswordResetResponse requestReset(String email) {
        return userRepository.findByEmail(email).map(user -> {
            tokenRepository.deleteByUserId(user.getId());
            PasswordResetToken token = tokenRepository.save(PasswordResetToken.create(user));
            String resetUrl = frontUrl + "/reset-password?token=" + token.getToken();
            mailService.sendPasswordReset(user, resetUrl);
            String devResetUrl = mailService.isConfigured() ? null : resetUrl;
            return new PasswordResetResponse(devResetUrl);
        }).orElseGet(() -> new PasswordResetResponse(null));
    }

    @Transactional
    public void confirmReset(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_PASSWORD_RESET_TOKEN));

        if (resetToken.isExpired()) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD_RESET_TOKEN);
        }

        User user = resetToken.getUser();
        user.changePassword(passwordEncoder.encode(newPassword));
        resetToken.markUsed();
        log.info("Password reset completed userId={}", user.getId());
    }
}
