package com.brandconnect.repository;

import com.brandconnect.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
} 