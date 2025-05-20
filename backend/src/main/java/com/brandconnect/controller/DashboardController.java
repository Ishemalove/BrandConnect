package com.brandconnect.controller;

import com.brandconnect.model.Application;
import com.brandconnect.model.Campaign;
import com.brandconnect.model.Role;
import com.brandconnect.model.SavedCampaign;
import com.brandconnect.model.User;
import com.brandconnect.repository.ApplicationRepository;
import com.brandconnect.repository.CampaignRepository;
import com.brandconnect.repository.ProfileViewRepository;
import com.brandconnect.repository.SavedCampaignRepository;
import com.brandconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private SavedCampaignRepository savedCampaignRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfileViewRepository profileViewRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        
        Map<String, Object> stats = new HashMap<>();
        LocalDate today = LocalDate.now();
        LocalDate lastWeek = today.minus(1, ChronoUnit.WEEKS);
        LocalDate lastMonth = today.minus(1, ChronoUnit.MONTHS);
        
        if (user.getRole() == Role.BRAND) {
            // Brand stats
            List<Campaign> allCampaigns = campaignRepository.findAll();
            List<Campaign> myCampaigns = allCampaigns.stream()
                .filter(c -> c.getBrand() != null && c.getBrand().getId().equals(user.getId()))
                .collect(Collectors.toList());
                
            List<Campaign> lastMonthCampaigns = myCampaigns.stream()
                .filter(c -> c.getStartDate() != null && c.getStartDate().isAfter(lastMonth))
                .collect(Collectors.toList());
                
            List<Application> allApplications = applicationRepository.findAll();
            List<Application> myApplications = allApplications.stream()
                .filter(a -> a.getCampaign() != null && a.getCampaign().getBrand() != null 
                    && a.getCampaign().getBrand().getId().equals(user.getId()))
                .collect(Collectors.toList());
                
            List<Application> lastWeekApplications = myApplications.stream()
                .filter(a -> a.getAppliedAt() != null && 
                    a.getAppliedAt().isAfter(LocalDateTime.now().minus(7, ChronoUnit.DAYS)))
                .collect(Collectors.toList());
            
            // Calculate engagement rate
            double totalApplications = myApplications.size();
            double viewsEstimate = myCampaigns.size() * 100; // Placeholder, would be actual views
            double engagementRate = viewsEstimate > 0 ? (totalApplications / viewsEstimate) * 100 : 0;
            double lastMonthEngagement = 2.7; // Placeholder, would calculate from historical data
            
            // Active creators - count unique creators who applied
            long activeCreators = myApplications.stream()
                .map(a -> a.getCreator() != null ? a.getCreator().getId() : null)
                .filter(id -> id != null)
                .distinct()
                .count();
                
            long lastWeekCreators = lastWeekApplications.stream()
                .map(a -> a.getCreator() != null ? a.getCreator().getId() : null)
                .filter(id -> id != null)
                .distinct()
                .count();
            
            // Category distribution
            Map<String, Long> categoryDistribution = myCampaigns.stream()
                .filter(c -> c.getCategory() != null && !c.getCategory().isEmpty())
                .collect(Collectors.groupingBy(Campaign::getCategory, Collectors.counting()));
            
            // Stats for dashboard
            stats.put("totalCampaigns", myCampaigns.size());
            stats.put("campaignsChange", myCampaigns.size() - (myCampaigns.size() - lastMonthCampaigns.size()));
            stats.put("activeCreators", activeCreators);
            stats.put("creatorsChange", activeCreators - (activeCreators - lastWeekCreators));
            stats.put("engagementRate", Math.round(engagementRate * 10.0) / 10.0); // Round to 1 decimal
            stats.put("engagementChange", Math.round((engagementRate - lastMonthEngagement) * 10.0) / 10.0);
            stats.put("pendingApplications", myApplications.stream()
                .filter(a -> "PENDING".equals(a.getStatus()))
                .count());
            stats.put("categoryDistribution", categoryDistribution);
            
            // Campaign performance data
            List<Map<String, Object>> campaignPerformance = myCampaigns.stream()
                .limit(4) // top 4 campaigns
                .map(campaign -> {
                    Map<String, Object> performanceData = new HashMap<>();
                    performanceData.put("name", campaign.getTitle());
                    performanceData.put("views", (int)(Math.random() * 2000) + 1000); // Placeholder
                    
                    long applicationCount = myApplications.stream()
                        .filter(a -> a.getCampaign().getId().equals(campaign.getId()))
                        .count();
                    performanceData.put("applications", applicationCount);
                    
                    double campaignEngagement = Math.random() * 3 + 2; // Placeholder
                    performanceData.put("engagement", Math.round(campaignEngagement * 10.0) / 10.0);
                    
                    return performanceData;
                })
                .collect(Collectors.toList());
                
            stats.put("campaignPerformance", campaignPerformance);
            
        } else {
            // Creator stats
            List<Application> allApplications = applicationRepository.findAll();
            List<Application> myApplications = allApplications.stream()
                .filter(a -> a.getCreator() != null && a.getCreator().getId().equals(user.getId()))
                .collect(Collectors.toList());
                
            List<Application> lastWeekApplications = myApplications.stream()
                .filter(a -> a.getAppliedAt() != null && 
                    a.getAppliedAt().isAfter(LocalDateTime.now().minus(7, ChronoUnit.DAYS)))
                .collect(Collectors.toList());
                
            List<SavedCampaign> savedCampaigns = savedCampaignRepository.findAll().stream()
                .filter(sc -> sc.getUser() != null && sc.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
                
            List<SavedCampaign> lastWeekSaved = savedCampaigns.stream()
                .filter(sc -> sc.getCampaign() != null && sc.getCampaign().getStartDate() != null && 
                    sc.getCampaign().getStartDate().isAfter(lastWeek))
                .collect(Collectors.toList());
            
            // Real profile view data from the database
            LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
            long profileViews = profileViewRepository.countByCreatorId(user.getId());
            long lastWeekProfileViews = profileViewRepository.countByCreatorIdAndViewedAtBetween(
                user.getId(), weekAgo, LocalDateTime.now());
            
            // Add logging for debugging
            System.out.println("Profile views data for creator ID " + user.getId() + ":");
            System.out.println("Total profile views: " + profileViews);
            System.out.println("Last week profile views: " + lastWeekProfileViews);
            
            // Calculate percent change for profile views
            LocalDateTime twoWeeksAgo = LocalDateTime.now().minus(14, ChronoUnit.DAYS);
            long previousWeekViews = profileViewRepository.countByCreatorIdAndViewedAtBetween(
                user.getId(), twoWeeksAgo, weekAgo);
            
            // Calculate percentage change
            int profileViewsChange = 0;
            if (previousWeekViews > 0) {
                double percentChange = ((double) (lastWeekProfileViews - previousWeekViews) / previousWeekViews) * 100;
                profileViewsChange = (int) Math.round(percentChange);
                System.out.println("Profile views percent change: " + profileViewsChange + "%");
            }
            
            stats.put("savedCampaigns", savedCampaigns.size());
            stats.put("savedChange", savedCampaigns.size() - (savedCampaigns.size() - lastWeekSaved.size()));
            stats.put("applicationsSent", myApplications.size());
            stats.put("pendingApplications", myApplications.stream()
                .filter(a -> "PENDING".equals(a.getStatus()))
                .count());
            stats.put("profileViews", profileViews);
            stats.put("profileViewsChange", profileViewsChange);
            
            // Available categories for the creator
            List<Campaign> availableCampaigns = campaignRepository.findAll().stream()
                .filter(c -> c.getEndDate() == null || c.getEndDate().isAfter(today))
                .collect(Collectors.toList());
                
            Map<String, Long> categoryDistribution = availableCampaigns.stream()
                .filter(c -> c.getCategory() != null && !c.getCategory().isEmpty())
                .collect(Collectors.groupingBy(Campaign::getCategory, Collectors.counting()));
                
            stats.put("categoryDistribution", categoryDistribution);
        }
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/brand")
    public ResponseEntity<?> getBrandDashboard(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null || user.getRole() != Role.BRAND) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        return getDashboardStats(authentication);
    }
    
    @GetMapping("/creator")
    public ResponseEntity<?> getCreatorDashboard(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null || user.getRole() != Role.CREATOR) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        return getDashboardStats(authentication);
    }

    @GetMapping("/performance")
    public ResponseEntity<?> getPerformanceStats(Authentication authentication) {
        return getDashboardStats(authentication);
    }
} 