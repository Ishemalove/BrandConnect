package com.brandconnect.repository;

import com.brandconnect.model.SavedCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface SavedCampaignRepository extends JpaRepository<SavedCampaign, Long> {
} 