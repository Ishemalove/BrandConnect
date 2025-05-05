package com.brandconnect.controller;

import com.brandconnect.dto.ApplicationDTO;
import com.brandconnect.model.Application;
import com.brandconnect.model.Campaign;
import com.brandconnect.model.Role;
import com.brandconnect.model.User;
import com.brandconnect.repository.ApplicationRepository;
import com.brandconnect.repository.CampaignRepository;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ApplicationController {
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private UserRepository userRepository;

    // Creator applies to a campaign
    @PostMapping("/apply/{campaignId}")
    public ResponseEntity<?> applyToCampaign(@PathVariable Long campaignId, Authentication authentication) {
        try {
            User creator = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (creator == null) {
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }
            
            if (creator.getRole() != Role.CREATOR) {
                return ResponseEntity.status(403).body(Map.of("message", "Only creators can apply to campaigns"));
            }
            
            Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);
            if (campaignOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Campaign not found"));
            }
            
            // Prevent duplicate applications
            List<Application> existing = applicationRepository.findAll().stream()
                .filter(app -> app.getCreator() != null && app.getCampaign() != null &&
                       app.getCreator().getId().equals(creator.getId()) && 
                       app.getCampaign().getId().equals(campaignId))
                .collect(Collectors.toList());
                
            if (!existing.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Already applied to this campaign"));
            }
            
            Application application = new Application();
            application.setCreator(creator);
            application.setCampaign(campaignOpt.get());
            application.setStatus("PENDING");
            application.setAppliedAt(LocalDateTime.now());
            
            Application saved = applicationRepository.save(application);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error processing application: " + e.getMessage()));
        }
    }

    /**
     * The main unified endpoint to get all applications.
     * No authorization required - returns all applications with optional campaignId filtering.
     */
    @GetMapping("")
    public ResponseEntity<?> getAllApplications(
            @RequestParam(required = false) Long campaignId) {
        try {
            System.out.println("Received request to primary /applications endpoint");
            
            List<Application> applications;
            
            // Get all applications first
            applications = applicationRepository.findAll();
            System.out.println("Total applications in database: " + applications.size());
            
            // If campaign ID is provided, filter by campaign
            if (campaignId != null) {
                applications = applications.stream()
                    .filter(a -> a.getCampaign() != null && a.getCampaign().getId().equals(campaignId))
                    .collect(Collectors.toList());
                System.out.println("Filtered to " + applications.size() + " applications for campaign: " + campaignId);
            }
            
            // Convert to DTOs to avoid serialization issues
            List<ApplicationDTO> applicationDTOs = ApplicationDTO.fromList(applications);
            return ResponseEntity.ok(applicationDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error fetching applications: " + e.getMessage()));
        }
    }

    // Update application status (no authorization required)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            System.out.println("Received request to update application " + id + " status to: " + status);
            
            Optional<Application> appOpt = applicationRepository.findById(id);
            if (appOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
            }
            
            Application app = appOpt.get();
            app.setStatus(status);
            Application updated = applicationRepository.save(app);
            
            // Return DTO to avoid serialization issues
            return ResponseEntity.ok(ApplicationDTO.fromEntity(updated));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error updating application: " + e.getMessage()));
        }
    }
    
    // Legacy endpoints kept for backward compatibility
    // Each of these now calls the main endpoint
    
    /**
     * @deprecated Use the main endpoint /applications instead
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        System.out.println("Received request to deprecated /applications/my (redirecting to main endpoint)");
        return getAllApplications(null);
    }

    /**
     * @deprecated Use the main endpoint /applications?campaignId=X instead
     */
    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<?> getApplicationsForCampaign(@PathVariable Long campaignId, Authentication authentication) {
        System.out.println("Received request to deprecated /applications/campaign/{campaignId} (redirecting to main endpoint)");
        return getAllApplications(campaignId);
    }
    
    /**
     * @deprecated Use the main endpoint /applications instead
     */
    @GetMapping("/simple")
    public ResponseEntity<?> getSimpleApplications(Authentication authentication) {
        System.out.println("Received request to deprecated /applications/simple (redirecting to main endpoint)");
        return getAllApplications(null);
    }

    /**
     * @deprecated Use the main endpoint /applications instead
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplicationsNoAuth() {
        System.out.println("Received request to deprecated /applications/all (redirecting to main endpoint)");
        return getAllApplications(null);
    }

    /**
     * @deprecated Use the main endpoint /applications instead
     */
    @GetMapping("/list")
    public ResponseEntity<?> listAllApplications() {
        System.out.println("Received request to deprecated /applications/list (redirecting to main endpoint)");
        return getAllApplications(null);
    }
} 