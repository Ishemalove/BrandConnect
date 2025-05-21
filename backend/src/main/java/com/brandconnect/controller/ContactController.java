package com.brandconnect.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.brandconnect.model.ContactMessage;
import com.brandconnect.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.brandconnect.model.NewsletterSubscriber;
import com.brandconnect.repository.NewsletterSubscriberRepository;
import com.brandconnect.service.EmailService;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    @Autowired
    private EmailService emailService;

    @Value("${contact.notification.email:nkerabahizilove@gmail.com}")
    private String adminEmail;

    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody ContactRequest request) {
        System.out.println("Contact form submitted: " + request);
        // Save to DB
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name);
        msg.setEmail(request.email);
        msg.setMessage(request.message);
        msg.setSubscribe(request.subscribe);
        contactMessageRepository.save(msg);
        // Save newsletter subscription if requested
        if (request.subscribe && request.email != null && !request.email.isBlank()) {
            newsletterSubscriberRepository.findByEmail(request.email)
                .orElseGet(() -> {
                    NewsletterSubscriber sub = new NewsletterSubscriber();
                    sub.setEmail(request.email);
                    return newsletterSubscriberRepository.save(sub);
                });
            // Send notification to admin
            emailService.sendEmail(
                adminEmail,
                "New Newsletter Subscription",
                "A new user has subscribed to the newsletter: " + request.email
            );
            // Send confirmation to subscriber
            emailService.sendEmail(
                request.email,
                "Thank you for subscribing!",
                "Thank you for subscribing to our newsletter! You will receive updates from us."
            );
        }
        // (Email sending will be added next)
        return ResponseEntity.ok().body("Contact form received");
    }

    // DTO for contact form
    public static class ContactRequest {
        public String name;
        public String email;
        public String message;
        public boolean subscribe;

        @Override
        public String toString() {
            return "ContactRequest{" +
                    "name='" + name + '\'' +
                    ", email='" + email + '\'' +
                    ", message='" + message + '\'' +
                    ", subscribe=" + subscribe +
                    '}';
        }
    }
} 