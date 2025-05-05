// Mock data for the BrandConnect application

// User data
export const currentUser = {
  id: "user_1",
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "creator", // or "brand"
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  bio: "Digital content creator specializing in lifestyle and tech reviews with over 5 years of experience working with major brands.",
  categories: ["Technology", "Lifestyle", "Fashion"],
  platforms: ["Instagram", "YouTube", "TikTok"],
  socialLinks: {
    instagram: "https://instagram.com/alexjohnson",
    twitter: "https://twitter.com/alexjohnson",
    youtube: "https://youtube.com/alexjohnson",
    tiktok: "https://tiktok.com/@alexjohnson",
  },
}

export const brandUser = {
  id: "user_2",
  name: "TechGadget",
  email: "marketing@techgadget.com",
  role: "brand",
  avatar:
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
  bio: "Leading tech gadget company focused on innovative products for everyday use.",
  companyName: "TechGadget Inc.",
  website: "https://techgadget.com",
  industries: ["Technology", "Consumer Electronics", "Smart Home"],
}

// Campaign data
export const campaigns = [
  {
    id: "campaign_1",
    title: "Summer Tech Essentials",
    brand: {
      id: "brand_1",
      name: "TechGadget",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Technology",
    description:
      "Looking for tech influencers to showcase our latest summer gadgets including portable chargers, waterproof speakers, and outdoor tech accessories.",
    budget: "$1,000 - $3,000",
    deadline: "2023-07-15",
    requirements: "Min 10k followers, 3+ tech reviews in the past month",
    status: "Active",
    applicants: 24,
    views: 1248,
    saved: true,
  },
  {
    id: "campaign_2",
    title: "Fitness Apparel Launch",
    brand: {
      id: "brand_2",
      name: "ActiveFit",
      logo: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Fitness",
    description:
      "Launching a new line of sustainable fitness apparel and looking for fitness influencers to create authentic content showcasing our products.",
    budget: "$500 - $2,000",
    deadline: "2023-08-01",
    requirements: "Fitness-focused content creators with engaged audience",
    status: "Active",
    applicants: 18,
    views: 876,
    saved: false,
  },
  {
    id: "campaign_3",
    title: "Vegan Food Delivery",
    brand: {
      id: "brand_3",
      name: "GreenBite",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Food",
    description:
      "Seeking food bloggers and health-conscious creators to promote our vegan meal delivery service with exclusive discount codes for followers.",
    budget: "$300 - $1,500",
    deadline: "2023-07-20",
    requirements: "Food content creators with focus on healthy eating",
    status: "Active",
    applicants: 12,
    views: 645,
    saved: true,
  },
  {
    id: "campaign_4",
    title: "Travel Photography Series",
    brand: {
      id: "brand_4",
      name: "Wanderlust",
      logo: "https://images.unsplash.com/photo-1519160558534-579f5106e43f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Travel",
    description:
      "Looking for travel photographers to create a series of stunning visuals for our new travel booking platform.",
    budget: "$2,000 - $5,000",
    deadline: "2023-08-15",
    requirements: "Professional photography portfolio, travel content experience",
    status: "Active",
    applicants: 32,
    views: 1876,
    saved: false,
  },
  {
    id: "campaign_5",
    title: "Skincare Routine",
    brand: {
      id: "brand_5",
      name: "GlowUp",
      logo: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Beauty",
    description:
      "Seeking beauty influencers to create authentic skincare routines featuring our new natural skincare line.",
    budget: "$800 - $2,500",
    deadline: "2023-07-30",
    requirements: "Beauty content creators with engaged followers",
    status: "Active",
    applicants: 28,
    views: 1542,
    saved: true,
  },
  {
    id: "campaign_6",
    title: "Smart Home Integration",
    brand: {
      id: "brand_6",
      name: "HomeConnect",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image: "https://images.unsplash.com/photo-1558002038-1055e2dae1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Technology",
    description:
      "Looking for tech reviewers and home decor influencers to showcase our new smart home integration system.",
    budget: "$1,500 - $4,000",
    deadline: "2023-08-10",
    requirements: "Tech reviewers with experience in smart home products",
    status: "Active",
    applicants: 15,
    views: 932,
    saved: false,
  },
  {
    id: "campaign_7",
    title: "Sustainable Fashion",
    brand: {
      id: "brand_7",
      name: "EcoStyle",
      logo: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    description:
      "Seeking fashion influencers passionate about sustainability to promote our eco-friendly clothing line.",
    budget: "$700 - $2,000",
    deadline: "2023-07-25",
    requirements: "Fashion content with focus on sustainability",
    status: "Active",
    applicants: 22,
    views: 1124,
    saved: true,
  },
  {
    id: "campaign_8",
    title: "Gaming Accessories",
    brand: {
      id: "brand_8",
      name: "GamePro",
      logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Gaming",
    description:
      "Looking for gaming content creators to review and showcase our new line of premium gaming accessories.",
    budget: "$1,000 - $3,500",
    deadline: "2023-08-05",
    requirements: "Gaming channels with min 5k subscribers",
    status: "Active",
    applicants: 19,
    views: 1356,
    saved: false,
  },
]

// Saved campaigns (subset of campaigns that are saved)
export const savedCampaigns = campaigns.filter((campaign) => campaign.saved)

// Applications data
export const applications = [
  {
    id: "application_1",
    campaign: {
      id: "campaign_1",
      title: "Summer Tech Essentials",
      brand: {
        id: "brand_1",
        name: "TechGadget",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    status: "Pending",
    appliedDate: "2023-06-15",
    proposal:
      "I'd love to create a series of tech reviews for your summer gadgets, focusing on how they enhance outdoor activities and travel.",
    compensation: "$1,500",
  },
  {
    id: "application_2",
    campaign: {
      id: "campaign_3",
      title: "Vegan Food Delivery",
      brand: {
        id: "brand_3",
        name: "GreenBite",
        logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    status: "Accepted",
    appliedDate: "2023-06-10",
    proposal:
      "As someone who regularly creates content about plant-based eating, I'm excited to showcase your vegan meal delivery service to my audience.",
    compensation: "$800",
  },
  {
    id: "application_3",
    campaign: {
      id: "campaign_5",
      title: "Skincare Routine",
      brand: {
        id: "brand_5",
        name: "GlowUp",
        logo: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    status: "Rejected",
    appliedDate: "2023-06-05",
    proposal:
      "I would create a morning and evening skincare routine video featuring your products, highlighting the natural ingredients and benefits.",
    compensation: "$1,200",
  },
]

// Conversations data
export const conversations = [
  {
    id: "conversation_1",
    with: {
      id: "brand_1",
      name: "TechGadget",
      avatar:
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      online: true,
    },
    lastMessage: "I'm interested in your campaign",
    timestamp: "10:30 AM",
    unread: true,
    messages: [
      {
        id: "msg_1",
        senderId: "user_1",
        text: "Hi there! I saw your Summer Tech Essentials campaign and I'm very interested in collaborating.",
        timestamp: "10:15 AM",
      },
      {
        id: "msg_2",
        senderId: "brand_1",
        text: "Hello! Thanks for reaching out. We'd love to hear more about your ideas for the campaign.",
        timestamp: "10:20 AM",
      },
      {
        id: "msg_3",
        senderId: "user_1",
        text: "Great! I have experience working with tech brands and my audience is primarily interested in portable tech and gadgets.",
        timestamp: "10:22 AM",
      },
      {
        id: "msg_4",
        senderId: "brand_1",
        text: "That sounds perfect for what we're looking for. Could you share some examples of your previous work?",
        timestamp: "10:25 AM",
      },
      {
        id: "msg_5",
        senderId: "user_1",
        text: "Of course! I've attached some links to my recent tech reviews. Let me know what you think!",
        timestamp: "10:28 AM",
      },
      {
        id: "msg_6",
        senderId: "brand_1",
        text: "These look great! I'm impressed with your content quality. Let's discuss the specifics of the campaign. Are you available for a quick call tomorrow?",
        timestamp: "10:30 AM",
      },
    ],
  },
  {
    id: "conversation_2",
    with: {
      id: "brand_2",
      name: "ActiveFit",
      avatar:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      online: true,
    },
    lastMessage: "Thanks for applying to our campaign",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        id: "msg_1",
        senderId: "brand_2",
        text: "Thanks for applying to our Fitness Apparel Launch campaign!",
        timestamp: "Yesterday, 2:15 PM",
      },
      {
        id: "msg_2",
        senderId: "user_1",
        text: "I'm excited about the opportunity to work with your brand. Your sustainable approach to fitness apparel aligns perfectly with my content.",
        timestamp: "Yesterday, 2:30 PM",
      },
      {
        id: "msg_3",
        senderId: "brand_2",
        text: "We're reviewing applications now and will get back to you soon with next steps.",
        timestamp: "Yesterday, 3:00 PM",
      },
    ],
  },
  {
    id: "conversation_3",
    with: {
      id: "brand_3",
      name: "GreenBite",
      avatar:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      online: false,
    },
    lastMessage: "We'd like to schedule a call to discuss",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        id: "msg_1",
        senderId: "brand_3",
        text: "We've reviewed your application for our Vegan Food Delivery campaign and we're impressed!",
        timestamp: "Yesterday, 10:15 AM",
      },
      {
        id: "msg_2",
        senderId: "user_1",
        text: "That's great to hear! I'm really excited about this campaign.",
        timestamp: "Yesterday, 10:30 AM",
      },
      {
        id: "msg_3",
        senderId: "brand_3",
        text: "We'd like to schedule a call to discuss the details. Are you available tomorrow at 2 PM?",
        timestamp: "Yesterday, 11:00 AM",
      },
      {
        id: "msg_4",
        senderId: "user_1",
        text: "Yes, that works for me. Looking forward to it!",
        timestamp: "Yesterday, 11:15 AM",
      },
    ],
  },
]

// Performance data for creators
export const creatorPerformance = {
  profileViews: {
    total: 1248,
    change: 15, // percentage change
    data: [45, 52, 38, 24, 33, 56, 58, 40, 39, 36, 52, 48, 58, 50],
  },
  campaignsApplied: {
    total: 12,
    change: 20,
    data: [1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 2, 1],
  },
  acceptanceRate: {
    total: 75, // percentage
    change: 5,
    data: [70, 65, 80, 75, 70, 75, 80, 75, 70, 75, 80, 75],
  },
  earnings: {
    total: 4500,
    change: 25,
    data: [300, 450, 200, 500, 350, 400, 600, 300, 450, 350, 400, 200],
  },
  engagementRate: {
    total: 4.8, // percentage
    change: 0.5,
    data: [4.2, 4.5, 4.3, 4.7, 4.8, 5.0, 4.9, 4.7, 4.8, 5.1, 4.9, 4.8],
  },
  topCategories: [
    { name: "Technology", percentage: 45 },
    { name: "Lifestyle", percentage: 30 },
    { name: "Fashion", percentage: 15 },
    { name: "Food", percentage: 10 },
  ],
  recentCampaigns: [
    {
      id: "campaign_1",
      title: "Summer Tech Essentials",
      brand: "TechGadget",
      status: "In Progress",
      earnings: "$1,500",
      engagement: "4.9%",
    },
    {
      id: "campaign_3",
      title: "Vegan Food Delivery",
      brand: "GreenBite",
      status: "Completed",
      earnings: "$800",
      engagement: "5.2%",
    },
    {
      id: "campaign_7",
      title: "Sustainable Fashion",
      brand: "EcoStyle",
      status: "Completed",
      earnings: "$1,200",
      engagement: "4.7%",
    },
  ],
}

// Performance data for brands
export const brandPerformance = {
  campaignViews: {
    total: 5842,
    change: 22, // percentage change
    data: [320, 350, 400, 450, 420, 480, 520, 480, 500, 550, 600, 580, 592],
  },
  applications: {
    total: 87,
    change: 15,
    data: [5, 7, 6, 8, 7, 9, 8, 7, 10, 8, 7, 5],
  },
  conversionRate: {
    total: 3.2, // percentage
    change: 0.5,
    data: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.2, 3.3, 3.4, 3.5, 3.2],
  },
  engagementRate: {
    total: 4.5, // percentage
    change: 0.3,
    data: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4, 4.5, 4.6, 4.7, 4.5],
  },
  activeCampaigns: {
    total: 5,
    change: 2,
    data: [2, 3, 3, 4, 4, 3, 4, 5, 5, 4, 5, 5],
  },
  topCategories: [
    { name: "Technology", percentage: 40 },
    { name: "Fashion", percentage: 25 },
    { name: "Food", percentage: 20 },
    { name: "Lifestyle", percentage: 15 },
  ],
  topPerformingCampaigns: [
    {
      id: "campaign_1",
      title: "Summer Tech Essentials",
      views: 1248,
      applications: 24,
      engagement: "4.8%",
    },
    {
      id: "campaign_5",
      title: "Skincare Routine",
      views: 1542,
      applications: 28,
      engagement: "5.2%",
    },
    {
      id: "campaign_7",
      title: "Sustainable Fashion",
      views: 1124,
      applications: 22,
      engagement: "4.7%",
    },
  ],
}

// Creators data
export const creators = [
  {
    id: "creator_1",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    categories: ["Technology", "Lifestyle"],
    followers: "56K",
    engagementRate: "4.8%",
    bio: "Tech reviewer and lifestyle content creator",
    platforms: ["Instagram", "YouTube", "TikTok"],
    recentWork: [
      {
        title: "Tech Review",
        image:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Lifestyle Vlog",
        image:
          "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "creator_2",
    name: "Sophia Lee",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    categories: ["Beauty", "Fashion"],
    followers: "120K",
    engagementRate: "5.2%",
    bio: "Beauty and fashion content creator",
    platforms: ["Instagram", "YouTube", "TikTok"],
    recentWork: [
      {
        title: "Makeup Tutorial",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Fashion Haul",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "creator_3",
    name: "Marcus Chen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    categories: ["Food", "Travel"],
    followers: "85K",
    engagementRate: "4.9%",
    bio: "Food blogger and travel enthusiast",
    platforms: ["Instagram", "YouTube", "Blog"],
    recentWork: [
      {
        title: "Food Review",
        image:
          "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Travel Vlog",
        image:
          "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "creator_4",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    categories: ["Fitness", "Health"],
    followers: "92K",
    engagementRate: "5.0%",
    bio: "Fitness trainer and health advocate",
    platforms: ["Instagram", "YouTube", "TikTok"],
    recentWork: [
      {
        title: "Workout Routine",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Healthy Recipes",
        image:
          "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "creator_5",
    name: "James Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    categories: ["Gaming", "Technology"],
    followers: "150K",
    engagementRate: "4.7%",
    bio: "Gaming content creator and tech enthusiast",
    platforms: ["YouTube", "Twitch", "TikTok"],
    recentWork: [
      {
        title: "Game Review",
        image:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Tech Unboxing",
        image:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
]
