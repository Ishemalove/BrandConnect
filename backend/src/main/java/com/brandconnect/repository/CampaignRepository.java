package com.brandconnect.repository;

import com.brandconnect.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
} 