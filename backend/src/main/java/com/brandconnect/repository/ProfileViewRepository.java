package com.brandconnect.repository;

import com.brandconnect.model.ProfileView;
import com.brandconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProfileViewRepository extends JpaRepository<ProfileView, Long> {
    // Find all profile views for a specific creator
    List<ProfileView> findByCreatorId(Long creatorId);
    
    // Find profile views for a creator in a date range
    List<ProfileView> findByCreatorIdAndViewedAtBetween(Long creatorId, LocalDateTime start, LocalDateTime end);
    
    // Count total profile views for a creator
    long countByCreatorId(Long creatorId);
    
    // Count profile views for a creator in a date range
    long countByCreatorIdAndViewedAtBetween(Long creatorId, LocalDateTime start, LocalDateTime end);
    
    // Check if a brand has already viewed a creator within a time period
    boolean existsByViewerIdAndCreatorIdAndViewedAtAfter(Long viewerId, Long creatorId, LocalDateTime since);
    
    // Custom query to group views by creator and count them
    @Query("SELECT pv.creator.id, COUNT(pv) FROM ProfileView pv GROUP BY pv.creator.id")
    List<Object[]> countViewsGroupedByCreator();
} 