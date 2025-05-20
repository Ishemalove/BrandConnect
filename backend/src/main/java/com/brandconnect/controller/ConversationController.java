package com.brandconnect.controller;

import com.brandconnect.model.*;
import com.brandconnect.service.ConversationService;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import com.brandconnect.dto.ConversationDTO;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ConversationDTO> getConversations(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Conversation> conversations = conversationService.getUserConversations(user);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        return conversations.stream().map(conv -> {
            ConversationDTO dto = new ConversationDTO();
            dto.setId(conv.getId());
            // Determine the other user
            User other = conv.getUser1().getId().equals(user.getId()) ? conv.getUser2() : conv.getUser1();
            dto.setOtherUserId(other.getId());
            dto.setOtherUserName(other.getName() != null ? other.getName() : "Unknown User");
            dto.setOtherUserAvatar(other.getAvatar() != null ? other.getAvatar() : "/placeholder.jpg");
            dto.setOtherUserOnline(other.isOnline());
            // Add user1 and user2 info
            dto.setUser1Id(conv.getUser1().getId());
            dto.setUser1Name(conv.getUser1().getName());
            dto.setUser2Id(conv.getUser2().getId());
            dto.setUser2Name(conv.getUser2().getName());
            // Messages
            List<Message> messages = conv.getMessages();
            dto.setTotalMessages(messages != null ? messages.size() : 0);
            if (messages != null && !messages.isEmpty()) {
                Message last = messages.get(messages.size() - 1);
                dto.setLastMessage(last.getContent());
                dto.setLastMessageTime(last.getTimestamp() != null ? last.getTimestamp().format(formatter) : "");
            }
            return dto;
        }).toList();
    }

    @PostMapping
    public Conversation startConversation(
        Principal principal,
        @RequestParam Long recipientId,
        @RequestParam String initialMessage
    ) {
        User user1 = userRepository.findByEmail(principal.getName()).orElseThrow();
        User user2 = userRepository.findById(recipientId).orElseThrow();
        return conversationService.startConversation(user1, user2, initialMessage);
    }

    @GetMapping("/{id}")
    public List<Message> getMessages(@PathVariable Long id) {
        return conversationService.getMessages(id);
    }

    @PostMapping("/{id}/messages")
    public Message sendMessage(
        Principal principal,
        @PathVariable Long id,
        @RequestParam String content
    ) {
        User sender = userRepository.findByEmail(principal.getName()).orElseThrow();
        return conversationService.sendMessage(id, sender, content);
    }
} 