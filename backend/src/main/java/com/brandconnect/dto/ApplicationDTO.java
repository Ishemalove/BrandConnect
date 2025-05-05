package com.brandconnect.dto;

import com.brandconnect.model.Application;
import com.brandconnect.model.Campaign;
import com.brandconnect.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ApplicationDTO {
    private Long id;
    private String status;
    private LocalDateTime appliedAt;
    private String message;
    private Long campaignId;
    private Long creatorId;
    private CampaignDTO campaign;
    private UserDTO creator;

    public ApplicationDTO() {
    }

    public ApplicationDTO(Application application) {
        this.id = application.getId();
        this.status = application.getStatus();
        this.appliedAt = application.getAppliedAt();
        this.message = application.getMessage();
        
        if (application.getCampaign() != null) {
            this.campaignId = application.getCampaign().getId();
            this.campaign = new CampaignDTO(application.getCampaign());
        }
        
        if (application.getCreator() != null) {
            this.creatorId = application.getCreator().getId();
            this.creator = new UserDTO(application.getCreator());
        }
    }

    public static List<ApplicationDTO> fromList(List<Application> applications) {
        return applications.stream()
                .map(ApplicationDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Creates a DTO from a single Application entity
     * @param application The application entity
     * @return ApplicationDTO object
     */
    public static ApplicationDTO fromEntity(Application application) {
        return new ApplicationDTO(application);
    }

    // Nested DTO for Campaign
    public static class CampaignDTO {
        private Long id;
        private String title;
        private String description;
        private String imageUrl;
        private String category;
        private BrandDTO brand;

        public CampaignDTO() {
        }

        public CampaignDTO(Campaign campaign) {
            this.id = campaign.getId();
            this.title = campaign.getTitle();
            this.description = campaign.getDescription();
            this.imageUrl = campaign.getImageUrl();
            this.category = campaign.getCategory();
            
            if (campaign.getBrand() != null) {
                this.brand = new BrandDTO(campaign.getBrand());
            }
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public BrandDTO getBrand() { return brand; }
        public void setBrand(BrandDTO brand) { this.brand = brand; }
    }

    // Nested DTO for User (Brand)
    public static class BrandDTO {
        private Long id;
        private String name;
        private String logo;

        public BrandDTO() {
        }

        public BrandDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            // Add logo field later if available
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLogo() { return logo; }
        public void setLogo(String logo) { this.logo = logo; }
    }

    // Nested DTO for User (Creator)
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;

        public UserDTO() {
        }

        public UserDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
    public CampaignDTO getCampaign() { return campaign; }
    public void setCampaign(CampaignDTO campaign) { this.campaign = campaign; }
    public UserDTO getCreator() { return creator; }
    public void setCreator(UserDTO creator) { this.creator = creator; }
} 