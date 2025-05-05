package com.brandconnect.controller;

import com.brandconnect.model.Campaign;
import com.brandconnect.model.Role;
import com.brandconnect.model.User;
import com.brandconnect.repository.CampaignRepository;
import com.brandconnect.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin; 

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private UserRepository userRepository;

    // List all campaigns (for creators and brands)
    @GetMapping
    public ResponseEntity<?> getAllCampaigns() {
        try {
            List<Campaign> campaigns = campaignRepository.findAll();
            
            // Map to simplified DTOs to avoid lazy loading issues
            List<CampaignDTO> campaignDTOs = campaigns.stream()
                .map(campaign -> new CampaignDTO(campaign))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(campaignDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching campaigns: " + e.getMessage());
        }
    }

    // Get campaign by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCampaign(@PathVariable Long id) {
        try {
            Optional<Campaign> campaignOpt = campaignRepository.findById(id);
            if (!campaignOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Campaign campaign = campaignOpt.get();
            return ResponseEntity.ok(new CampaignDTO(campaign));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching campaign: " + e.getMessage());
        }
    }

    // Create campaign (brand only)
    @PostMapping
    public ResponseEntity<?> createCampaign(@RequestBody Campaign campaign, Authentication authentication) {
        System.out.println("Creating campaign - Authentication name: " + 
            (authentication != null ? authentication.getName() : "null"));
        
        if (authentication == null) {
            System.out.println("Authentication is null");
            return ResponseEntity.status(403).body("Authentication required");
        }
        
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        System.out.println("User from DB: " + (user != null ? 
            "ID: " + user.getId() + ", Email: " + user.getEmail() + ", Role: " + user.getRole() : "null"));
        
        if (user == null) {
            System.out.println("User not found for email: " + authentication.getName());
            return ResponseEntity.status(403).body("User not found");
        }
        
        // Only allow BRAND users to create campaigns
        if (user.getRole() != Role.BRAND) {
            System.out.println("User is not a BRAND. Actual role: " + user.getRole());
            return ResponseEntity.status(403).body("Only brands can create campaigns");
        }
        
        try {
            campaign.setBrand(user);
            Campaign saved = campaignRepository.save(campaign);
            System.out.println("Campaign saved successfully with ID: " + saved.getId());
            return ResponseEntity.ok(new CampaignDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating campaign: " + e.getMessage());
        }
    }

    // Update campaign (brand only, must own campaign)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCampaign(@PathVariable Long id, @RequestBody Campaign updated, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            Optional<Campaign> campaignOpt = campaignRepository.findById(id);
            if (user == null || user.getRole() != Role.BRAND || campaignOpt.isEmpty() || !campaignOpt.get().getBrand().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Not authorized");
            }
            Campaign campaign = campaignOpt.get();
            campaign.setTitle(updated.getTitle());
            campaign.setDescription(updated.getDescription());
            campaign.setCategory(updated.getCategory());
            campaign.setImageUrl(updated.getImageUrl());
            campaign.setEndDate(updated.getEndDate());
            campaign.setRequirements(updated.getRequirements());
            campaign.setDeliverables(updated.getDeliverables());
            campaign.setCampaignType(updated.getCampaignType());
            campaign.setStartDate(updated.getStartDate());
            
            Campaign saved = campaignRepository.save(campaign);
            return ResponseEntity.ok(new CampaignDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating campaign: " + e.getMessage());
        }
    }

    // Delete campaign (brand only, must own campaign)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            Optional<Campaign> campaignOpt = campaignRepository.findById(id);
            if (user == null || user.getRole() != Role.BRAND || campaignOpt.isEmpty() || !campaignOpt.get().getBrand().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Not authorized");
            }
            campaignRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting campaign: " + e.getMessage());
        }
    }
    
    // DTO to avoid lazy loading issues
    public static class CampaignDTO {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String imageUrl;
        private LocalDate endDate;
        private LocalDate startDate;
        private String requirements;
        private String deliverables;
        private String campaignType;
        private UserDTO brand;
        
        public CampaignDTO(Campaign campaign) {
            this.id = campaign.getId();
            this.title = campaign.getTitle();
            this.description = campaign.getDescription();
            this.category = campaign.getCategory();
            this.imageUrl = campaign.getImageUrl();
            this.endDate = campaign.getEndDate();
            this.startDate = campaign.getStartDate();
            this.requirements = campaign.getRequirements();
            this.deliverables = campaign.getDeliverables();
            this.campaignType = campaign.getCampaignType();
            
            if (campaign.getBrand() != null) {
                this.brand = new UserDTO(campaign.getBrand());
            }
        }
        
        // Getters
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public String getImageUrl() { return imageUrl; }
        public LocalDate getEndDate() { return endDate; }
        public LocalDate getStartDate() { return startDate; }
        public String getRequirements() { return requirements; }
        public String getDeliverables() { return deliverables; }
        public String getCampaignType() { return campaignType; }
        public UserDTO getBrand() { return brand; }
    }
    
    // Simplified User DTO
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
        
        public UserDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole().toString();
        }
        
        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
} 