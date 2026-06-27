package com.cj.devhunt.chat.presentation.dto;

import java.time.Instant;

public record ChatLevel1PongResponse(
        String sender,
        String message,
        Instant serverTime
) {
}
