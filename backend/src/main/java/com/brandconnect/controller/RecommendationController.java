package com.brandconnect.controller;

import com.brandconnect.model.Campaign;
import com.brandconnect.model.Role;
import com.brandconnect.model.User;
import com.brandconnect.repository.CampaignRepository;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getRecommendations(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (user.getRole() == Role.CREATOR) {
            // Recommend campaigns (e.g., by category, not already applied/saved)
            List<Campaign> all = campaignRepository.findAll();
            // For demo: recommend first 5 campaigns not created by this user
            List<Campaign> recommended = all.stream()
                .filter(c -> !c.getBrand().getId().equals(user.getId()))
                .limit(5)
                .collect(Collectors.toList());
            return ResponseEntity.ok(recommended);
        } else if (user.getRole() == Role.BRAND) {
            // Recommend creators (for demo: all users with CREATOR role)
            List<User> creators = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CREATOR)
                .limit(5)
                .collect(Collectors.toList());
            return ResponseEntity.ok(creators);
        }
        return ResponseEntity.badRequest().body("Invalid role");
    }
} 