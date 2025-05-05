package com.brandconnect.controller;

import com.brandconnect.model.Application;
import com.brandconnect.model.ProfileView;
import com.brandconnect.model.Role;
import com.brandconnect.model.User;
import com.brandconnect.repository.ApplicationRepository;
import com.brandconnect.repository.ProfileViewRepository;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile-views")
public class ProfileViewController {
    @Autowired
    private ProfileViewRepository profileViewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    // Record a new profile view (brand viewing a creator)
    @PostMapping("/track")
    public ResponseEntity<?> trackProfileView(
            @RequestParam Long creatorId, 
            @RequestParam(required = false) Long applicationId, 
            Authentication authentication) {
        try {
            System.out.println("\n======= TRACKING PROFILE VIEW =======");
            System.out.println("Creator ID: " + creatorId);
            System.out.println("Application ID: " + applicationId);
            System.out.println("Authenticated user: " + authentication.getName());
            
            // Get the current user (the brand)
            User viewer = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (viewer == null) {
                System.out.println("ERROR: Viewer not found for email: " + authentication.getName());
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }
            
            System.out.println("Viewer found: ID=" + viewer.getId() + ", Role=" + viewer.getRole());
            
            // Only brands can view creator profiles
            if (viewer.getRole() != Role.BRAND) {
                System.out.println("ERROR: User role is not BRAND: " + viewer.getRole());
                return ResponseEntity.status(403).body(Map.of("message", "Only brands can view creator profiles"));
            }
            
            // Find the creator
            Optional<User> creatorOpt = userRepository.findById(creatorId);
            if (creatorOpt.isEmpty()) {
                System.out.println("ERROR: Creator not found with ID: " + creatorId);
                return ResponseEntity.badRequest().body(Map.of("message", "Creator not found"));
            }
            
            User creator = creatorOpt.get();
            System.out.println("Creator found: ID=" + creator.getId() + ", Role=" + creator.getRole());
            
            // Verify the creator is actually a creator
            if (creator.getRole() != Role.CREATOR) {
                System.out.println("ERROR: User with ID " + creatorId + " is not a creator: " + creator.getRole());
                return ResponseEntity.badRequest().body(Map.of("message", "The user is not a creator"));
            }
            
            // Get the application if an applicationId was provided
            Application application = null;
            if (applicationId != null) {
                application = applicationRepository.findById(applicationId).orElse(null);
                System.out.println("Application " + (application != null ? "found" : "not found") + " with ID: " + applicationId);
            }
            
            // Prevent duplicate views from the same brand within a short time period (e.g., 1 hour)
            LocalDateTime oneHourAgo = LocalDateTime.now().minus(1, ChronoUnit.HOURS);
            boolean recentlyViewed = profileViewRepository.existsByViewerIdAndCreatorIdAndViewedAtAfter(
                    viewer.getId(), creatorId, oneHourAgo);
                    
            if (recentlyViewed) {
                System.out.println("Profile was recently viewed by this brand - skipping duplicate tracking");
                return ResponseEntity.ok(Map.of(
                    "message", "Profile view already recorded recently",
                    "trackingSkipped", true
                ));
            }
            
            // Create and save the profile view
            ProfileView profileView = new ProfileView();
            profileView.setViewer(viewer);
            profileView.setCreator(creator);
            profileView.setViewedAt(LocalDateTime.now());
            profileView.setApplication(application);
            
            ProfileView saved = profileViewRepository.save(profileView);
            System.out.println("Profile view saved successfully with ID: " + saved.getId());
            System.out.println("======= PROFILE VIEW TRACKING COMPLETE =======\n");
            
            return ResponseEntity.ok(Map.of(
                "message", "Profile view tracked successfully",
                "creatorId", creatorId,
                "viewId", saved.getId()
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error tracking profile view: " + e.getMessage()));
        }
    }
    
    // Get profile view stats for the authenticated creator
    @GetMapping("/stats")
    public ResponseEntity<?> getProfileViewStats(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }
            
            if (user.getRole() != Role.CREATOR) {
                return ResponseEntity.status(403).body(Map.of("message", "Only creators can view their profile stats"));
            }
            
            // Get total views
            long totalViews = profileViewRepository.countByCreatorId(user.getId());
            
            // Get views in the last week
            LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
            long lastWeekViews = profileViewRepository.countByCreatorIdAndViewedAtBetween(
                    user.getId(), weekAgo, LocalDateTime.now());
                    
            // Get views in the previous week for comparison
            LocalDateTime twoWeeksAgo = LocalDateTime.now().minus(14, ChronoUnit.DAYS);
            long previousWeekViews = profileViewRepository.countByCreatorIdAndViewedAtBetween(
                    user.getId(), twoWeeksAgo, weekAgo);
                    
            // Calculate week-over-week change
            double percentChange = 0;
            if (previousWeekViews > 0) {
                percentChange = ((double) (lastWeekViews - previousWeekViews) / previousWeekViews) * 100;
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalViews", totalViews);
            stats.put("lastWeekViews", lastWeekViews);
            stats.put("previousWeekViews", previousWeekViews);
            stats.put("percentChange", Math.round(percentChange * 10) / 10.0); // Round to 1 decimal place
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error fetching profile view stats: " + e.getMessage()));
        }
    }
} 