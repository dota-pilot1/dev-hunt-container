package com.cj.devhunt.chat.presentation;

import com.cj.devhunt.chat.presentation.dto.ChatLevel1PingRequest;
import com.cj.devhunt.chat.presentation.dto.ChatLevel1PongResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
public class ChatStudyMessageController {

    @MessageMapping("/chat.level1.ping")
    @SendTo("/topic/chat.level1.pong")
    public ChatLevel1PongResponse ping(ChatLevel1PingRequest request) {
        String sender = request.sender() == null || request.sender().isBlank()
                ? "anonymous"
                : request.sender().trim();
        String message = request.message() == null || request.message().isBlank()
                ? "ping"
                : request.message().trim();

        return new ChatLevel1PongResponse(sender, "pong: " + message, Instant.now());
    }
}
