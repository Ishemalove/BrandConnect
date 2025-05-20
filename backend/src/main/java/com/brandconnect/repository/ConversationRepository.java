package com.brandconnect.repository;

import com.brandconnect.model.Conversation;
import com.brandconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUser1OrUser2(User user1, User user2);
} 