package com.brandconnect.controller;

import com.brandconnect.model.Campaign;
import com.brandconnect.model.Role;
import com.brandconnect.model.SavedCampaign;
import com.brandconnect.model.User;
import com.brandconnect.repository.CampaignRepository;
import com.brandconnect.repository.SavedCampaignRepository;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved-campaigns")
public class SavedCampaignController {
    @Autowired
    private SavedCampaignRepository savedCampaignRepository;
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private UserRepository userRepository;

    // Save a campaign (creator only)
    @PostMapping("/save/{campaignId}")
    public ResponseEntity<?> saveCampaign(@PathVariable Long campaignId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        
        // Check if user is a CREATOR
        if (user.getRole() != Role.CREATOR) {
            return ResponseEntity.status(403).body("Only creators can save campaigns");
        }
        
        Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);
        if (campaignOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Campaign not found");
        }
        
        // Prevent duplicate saves
        List<SavedCampaign> existing = savedCampaignRepository.findAll().stream()
            .filter(sc -> sc.getUser() != null && sc.getCampaign() != null &&
                   sc.getUser().getId().equals(user.getId()) && 
                   sc.getCampaign().getId().equals(campaignId))
            .collect(Collectors.toList());
            
        if (!existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Campaign already saved");
        }
        
        SavedCampaign saved = new SavedCampaign();
        saved.setUser(user);
        saved.setCampaign(campaignOpt.get());
        savedCampaignRepository.save(saved);
        return ResponseEntity.ok(saved);
    }

    // Unsave a campaign (creator only)
    @DeleteMapping("/unsave/{campaignId}")
    public ResponseEntity<?> unsaveCampaign(@PathVariable Long campaignId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        
        // Check if user is a CREATOR
        if (user.getRole() != Role.CREATOR) {
            return ResponseEntity.status(403).body("Only creators can unsave campaigns");
        }
        
        List<SavedCampaign> existing = savedCampaignRepository.findAll().stream()
            .filter(sc -> sc.getUser() != null && sc.getCampaign() != null && 
                   sc.getUser().getId().equals(user.getId()) && 
                   sc.getCampaign().getId().equals(campaignId))
            .collect(Collectors.toList());
            
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Saved campaign not found");
        }
        
        savedCampaignRepository.delete(existing.get(0));
        return ResponseEntity.ok().build();
    }

    // List saved campaigns for user (creator only)
    @GetMapping("/my")
    public ResponseEntity<?> getMySavedCampaigns(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        
        // Check if user is a CREATOR
        if (user.getRole() != Role.CREATOR) {
            return ResponseEntity.status(403).body("Only creators can view saved campaigns");
        }
        
        List<SavedCampaign> mySaved = savedCampaignRepository.findAll().stream()
            .filter(sc -> sc.getUser() != null && sc.getUser().getId().equals(user.getId()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(mySaved);
    }
} 