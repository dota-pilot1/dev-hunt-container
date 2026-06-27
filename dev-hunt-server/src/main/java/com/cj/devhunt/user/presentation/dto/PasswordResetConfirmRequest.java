package com.cj.devhunt.user.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PasswordResetConfirmRequest(
        @NotBlank(message = "토큰이 필요합니다.")
        String token,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,100}$", message = "비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.")
        String newPassword
) {
}
