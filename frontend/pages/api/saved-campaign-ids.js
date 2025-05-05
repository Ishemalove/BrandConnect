// This is a temporary API endpoint that provides a consistent format for saved campaigns
// based on the database structure shown in the SQL query

export default function handler(req, res) {
  // Get user ID from the auth token (simplified for this example)
  // In a real implementation, this would verify the JWT token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    console.log("API: Received request for saved-campaign-ids");
    
    // Mock data matching the SQL query result shown
    // In a real implementation, this would query the database
    const savedCampaigns = [
      { id: 1, campaign_id: 1, user_id: 12 },
      { id: 2, campaign_id: 3, user_id: 12 }
    ];
    
    console.log("API: Returning saved campaign IDs:", savedCampaigns);
    
    res.status(200).json(savedCampaigns);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 