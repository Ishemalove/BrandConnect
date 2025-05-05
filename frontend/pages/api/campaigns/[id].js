// Mock endpoint for campaign details

export default function handler(req, res) {
  const { id } = req.query;
  
  console.log(`API: Received request for campaign details, ID: ${id}`);
  
  // Create mock data for the campaign
  // In a real implementation, this would query the database
  const campaign = {
    id: parseInt(id),
    title: `Campaign ${id}`,
    description: `This is a detailed description for campaign ${id}. This content is coming from our mock API to ensure the saved campaigns are displayed properly.`,
    imageUrl: "https://placehold.co/600x400",
    category: `Category ${id % 3 === 0 ? 'Fashion' : id % 2 === 0 ? 'Technology' : 'Beauty'}`,
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    requirements: "Minimum 1000 followers, high engagement rate",
    budget: "$500-1000",
    brand: {
      id: 1,
      name: "Test Brand",
      logo: "https://placehold.co/100x100"
    },
    views: 150,
    applicants: 12
  };
  
  console.log(`API: Returning campaign details for ID ${id}`);
  
  res.status(200).json(campaign);
} 