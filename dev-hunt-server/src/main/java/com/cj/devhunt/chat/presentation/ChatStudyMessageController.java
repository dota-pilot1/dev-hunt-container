package com.cj.devhunt.chat.presentation;

import com.cj.devhunt.chat.presentation.dto.ChatLevel1PingRequest;
import com.cj.devhunt.chat.presentation.dto.ChatLevel1PongResponse;
import com.cj.devhunt.chat.presentation.dto.ChatLevel2MessageRequest;
import com.cj.devhunt.chat.presentation.dto.ChatLevel2MessageResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.UUID;

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

    @MessageMapping("/chat.level2.send")
    @SendTo("/topic/chat.level2.messages")
    public ChatLevel2MessageResponse sendMessage(ChatLevel2MessageRequest request) {
        String sender = request.sender() == null || request.sender().isBlank()
                ? "anonymous"
                : request.sender().trim();
        String content = request.content() == null || request.content().isBlank()
                ? "(empty)"
                : request.content().trim();

        return new ChatLevel2MessageResponse(UUID.randomUUID().toString(), sender, content, Instant.now());
    }
}
