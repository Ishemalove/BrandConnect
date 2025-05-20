package com.brandconnect.service;

import com.brandconnect.model.*;
import com.brandconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findByUser1OrUser2(user, user);
    }

    public Conversation startConversation(User user1, User user2, String initialMessage) {
        Conversation conversation = new Conversation();
        conversation.setUser1(user1);
        conversation.setUser2(user2);
        conversation = conversationRepository.save(conversation);

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(user1);
        message.setContent(initialMessage);
        message.setTimestamp(java.time.LocalDateTime.now());
        messageRepository.save(message);

        return conversation;
    }

    public List<Message> getMessages(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();
        return messageRepository.findByConversationOrderByTimestampAsc(conversation);
    }

    public Message sendMessage(Long conversationId, User sender, String content) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);
        message.setTimestamp(java.time.LocalDateTime.now());
        return messageRepository.save(message);
    }
} 