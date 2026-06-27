package com.cj.devhunt.notification.application;

import com.cj.devhunt.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${app.mail.from:no-reply@devhunt.local}")
    private String from;

    public boolean isConfigured() {
        return StringUtils.hasText(mailHost) && mailSenderProvider.getIfAvailable() != null;
    }

    public void sendPasswordReset(User user, String resetUrl) {
        if (!isConfigured()) {
            log.info("Password reset mail is not configured. userId={}, resetUrl={}", user.getId(), resetUrl);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getObject();

        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from);
            helper.setTo(user.getEmail());
            helper.setSubject("[DevHunt] 비밀번호 재설정 안내");
            helper.setText(buildHtml(user, resetUrl), true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send password reset mail. userId={}, resetUrl={}", user.getId(), resetUrl, e);
        }
    }

    private String buildHtml(User user, String resetUrl) {
        return """
                <div style="font-family:Arial,'Apple SD Gothic Neo',sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
                  <div style="background:#171717;padding:28px 32px">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#fff">DevHunt</p>
                  </div>
                  <div style="padding:34px 32px">
                    <h2 style="margin:0 0 10px;font-size:20px;color:#171717">비밀번호 재설정</h2>
                    <p style="margin:0 0 8px;color:#555;font-size:15px;line-height:1.6">안녕하세요, %s님.<br>아래 버튼을 눌러 새 비밀번호를 설정하세요.</p>
                    <p style="margin:0 0 24px;color:#777;font-size:13px">링크는 15분 동안 유효합니다.</p>
                    <a href="%s" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600">비밀번호 재설정</a>
                    <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.6">요청한 적이 없다면 이 메일을 무시하세요.</p>
                  </div>
                </div>
                """.formatted(user.getUsername(), resetUrl);
    }
}
