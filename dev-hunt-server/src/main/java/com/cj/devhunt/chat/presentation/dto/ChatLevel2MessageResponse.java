package com.cj.devhunt.chat.presentation.dto;

import java.time.Instant;

public record ChatLevel2MessageResponse(
        String id,
        String sender,
        String content,
        Instant sentAt
) {
}
