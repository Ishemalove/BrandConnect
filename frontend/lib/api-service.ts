"use client"

import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Add a reasonable timeout to prevent hanging requests
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    let token;
    
    try {
      // Try to get token from localStorage
      token = localStorage.getItem("token");
      
      // If no token in localStorage, try to get from user object
      if (!token) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          token = userData.token;
        }
      }
    } catch (error) {
      console.warn("Error reading token from storage:", error);
    }
    
    if (token) {
      console.log("Adding auth token to request:", config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found for API request to:", config.url);
    }
    
    // Add a timestamp parameter to prevent caching issues
    const isGetRequest = config.method?.toLowerCase() === 'get';
    if (isGetRequest) {
      config.params = {
        ...config.params,
        _t: new Date().getTime() // Add timestamp to prevent caching
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config?.url);
    } else if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('API Error:', error.config?.url, 'Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received (network error)
      console.error('Network Error - No response received:', error.config?.url);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Create a separate axios instance for the external backend
const externalApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Add a reasonable timeout to prevent hanging requests
})

// Add request interceptor to add auth token to externalApi as well
externalApi.interceptors.request.use(
  (config) => {
    let token;
    
    try {
      // Try to get token from localStorage
      token = localStorage.getItem("token");
      
      // If no token in localStorage, try to get from user object
      if (!token) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          token = userData.token;
        }
      }
    } catch (error) {
      console.warn("Error reading token from storage:", error);
    }
    
    if (token) {
      console.log("Adding auth token to external request:", config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found for external API request to:", config.url);
    }
    
    // Add a timestamp parameter to prevent caching issues
    const isGetRequest = config.method?.toLowerCase() === 'get';
    if (isGetRequest) {
      config.params = {
        ...config.params,
        _t: new Date().getTime() // Add timestamp to prevent caching
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for better error handling for externalApi too
externalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('External API timeout:', error.config?.url);
    } else if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('External API Error:', error.config?.url, 'Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received (network error)
      console.error('External Network Error - No response received:', error.config?.url);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up external request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/signin", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
  },

  register: async (userData: any) => {
    return api.post("/auth/signup", userData)
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (userStr) return JSON.parse(userStr)
    return null
  },
}

// User services
export const userService = {
  getBrandProfile: async (id: string) => {
    return api.get(`/users/brands/${id}`)
  },

  getCreatorProfile: async (id: string) => {
    return api.get(`/users/creators/${id}`)
  },

  updateBrandProfile: async (id: string, profileData: any) => {
    return api.put(`/users/brands/${id}`, profileData)
  },

  updateCreatorProfile: async (id: string, profileData: any) => {
    return api.put(`/users/creators/${id}`, profileData)
  },

  getCreators: async (params: any = {}) => {
    return api.get("/users/creators", { params })
  },
}

// Utility functions for local storage fallback
const localStorageKeys = {
  savedCampaigns: "brandconnect_saved_campaigns"
};

// Get saved campaign IDs from localStorage
const getLocalSavedCampaigns = (): number[] => {
  try {
    const savedJson = localStorage.getItem(localStorageKeys.savedCampaigns);
    if (savedJson) {
      const parsed = JSON.parse(savedJson);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading saved campaigns from localStorage:", e);
  }
  return [];
};

// Save campaign IDs to localStorage
const saveLocalCampaigns = (campaignIds: number[]): void => {
  try {
    localStorage.setItem(localStorageKeys.savedCampaigns, JSON.stringify(campaignIds));
  } catch (e) {
    console.error("Error saving campaigns to localStorage:", e);
  }
};

// Add a campaign ID to local storage
const addLocalSavedCampaign = (campaignId: number): void => {
  const campaigns = getLocalSavedCampaigns();
  if (!campaigns.includes(campaignId)) {
    campaigns.push(campaignId);
    saveLocalCampaigns(campaigns);
  }
};

// Remove a campaign ID from local storage
const removeLocalSavedCampaign = (campaignId: number): void => {
  const campaigns = getLocalSavedCampaigns();
  const updated = campaigns.filter(id => id !== campaignId);
  saveLocalCampaigns(updated);
};

// Campaign services
export const campaignService = {
  getCampaigns: async (params: any = {}) => {
    console.log('Fetching campaigns with params:', params);
    try {
      // Set a timeout of 10 seconds to prevent hanging requests
      const requestPromise = api.get("/campaigns", { params });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });
      
      return await Promise.race([requestPromise, timeoutPromise]) as any;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      
      // Create a better error object with user-friendly message
      const enhancedError = error as any;
      enhancedError.userMessage = "Failed to load campaigns. Please try again later.";
      
      // Default response for offline fallback (use empty array instead of null)
      const defaultResponse = {
        data: [],
        status: "error",
        message: "Failed to load campaigns, using fallback data"
      };
      
      // Return the empty default response on failure
      return { data: defaultResponse.data, status: "error" };
    }
  },

  getCampaign: async (id: string) => {
    try {
      console.log(`Fetching campaign details for ID ${id}`);
      const response = await api.get(`/campaigns/${id}`);
      console.log(`Successfully fetched campaign details for ID ${id}`);
      return response;
    } catch (error: any) {
      console.error(`Error fetching campaign ${id}:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '',
        error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '');
      
      // Try an alternative endpoint format in case the API structure is different
      try {
        console.log(`Trying alternative endpoint for campaign ID ${id}`);
        const fallbackResponse = await api.get(`/campaign/${id}`);
        console.log(`Successfully fetched campaign details for ID ${id} using alternative endpoint`);
        return fallbackResponse;
      } catch (fallbackError: any) {
        console.error(`Error fetching campaign ${id} from fallback endpoint:`, 
          fallbackError.name || 'Unknown error',
          fallbackError.message || '',
          fallbackError.response ? `Status: ${fallbackError.response.status}` : '');
        throw error; // Throw the original error
      }
    }
  },

  createCampaign: async (campaignData: any) => {
    // Debug current user role
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        console.log("Current user role:", userData.user?.role)
        
        // If CREATOR, warn about potential permission issues
        if (userData.user?.role === "CREATOR") {
          console.warn("Warning: Creators cannot create campaigns in the default configuration")
        }
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }
    
    // Fix the incorrect endpoint (removing duplicate /api/)
    try {
      const response = await externalApi.post("/campaigns", campaignData)
      return response
    } catch (error: any) {
      console.error("Campaign creation error:", 
        error.response?.status, 
        error.response?.data)
      throw error
    }
  },

  updateCampaign: async (id: string, campaignData: any) => {
    return api.put(`/campaigns/${id}`, campaignData)
  },

  deleteCampaign: async (id: string) => {
    return api.delete(`/campaigns/${id}`)
  },

  saveCampaign: async (campaignId: string) => {
    // Ensure campaignId is a string and not undefined
    if (!campaignId) {
      console.error("Invalid campaign ID provided");
      throw new Error("Invalid campaign ID");
    }
    
    // Safer conversion to string
    const id = String(campaignId);
    const numericId = parseInt(id, 10);
    
    // Always update local storage first (optimistic update)
    if (!isNaN(numericId)) {
      addLocalSavedCampaign(numericId);
    }
    
    try {
      console.log(`Saving campaign ID ${id} using endpoint: /saved-campaigns/save/${id}`);
      
      // Use a single reliable endpoint
      const response = await api.post(`/saved-campaigns/save/${id}`);
      console.log(`Successfully saved campaign ID ${id}`);
      return response;
    } catch (error: any) {
      // Check if this is the "already saved" error, which we can consider a success
      const errorData = error.response?.data;
      if (error.response?.status === 400 && 
          errorData && 
         (typeof errorData === 'string' && errorData.includes("already saved") || 
          errorData.message?.includes("already saved"))) {
        console.log(`Campaign ${id} was already saved, treating as success`);
        
        // Return a fabricated success response
        return {
          status: 200,
          data: { message: "Campaign already saved" },
          statusText: "OK",
          headers: {},
          config: error.config
        };
      }
      
      // If this isn't the "already saved" case, try a fallback endpoint
      try {
        console.log(`First endpoint failed, trying fallback for campaign ID ${id}`);
        const fallbackResponse = await api.post(`/campaigns/${id}/save`);
        console.log(`Successfully saved campaign ID ${id} using fallback endpoint`);
        return fallbackResponse;
      } catch (fallbackError: any) {
        // Log both errors for debugging
        console.error(`Error saving campaign ID ${id}:`, 
          error.name || 'Unknown error',
          error.message || '',
          error.response ? `Status: ${error.response.status}` : '',
          error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '',
          `Fallback error:`,
          fallbackError.message || 'Unknown');
        
        // Create a better user-facing error message
        const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Unable to save campaign on the server, but it's been saved locally.";
        
        // Since we've already updated localStorage, we can return a fabricated success
        // but with a flag indicating it was only saved locally
        return {
          status: 200,
          data: { 
            message: "Campaign saved locally only", 
            localOnly: true,
            campaignId: numericId
          },
          statusText: "OK",
          headers: {},
          config: error.config || {}
        };
      }
    }
  },

  unsaveCampaign: async (campaignId: string) => {
    // Ensure campaignId is a string and not undefined
    if (!campaignId) {
      console.error("Invalid campaign ID provided");
      throw new Error("Invalid campaign ID");
    }
    
    // Safer conversion to string
    const id = String(campaignId);
    const numericId = parseInt(id, 10);
    
    // Always update local storage first (optimistic update)
    if (!isNaN(numericId)) {
      removeLocalSavedCampaign(numericId);
    }
    
    try {
      console.log(`Unsaving campaign ID ${id} using endpoint: /saved-campaigns/unsave/${id}`);
      
      // Use a single reliable endpoint
      const response = await api.delete(`/saved-campaigns/unsave/${id}`);
      console.log(`Successfully unsaved campaign ID ${id}`);
      return response;
    } catch (error: any) {
      // Check if this is the "not found" error, which we can consider a success
      const errorData = error.response?.data;
      if ((error.response?.status === 400 || error.response?.status === 404) && 
          errorData && 
          (typeof errorData === 'string' && (errorData.includes("not found") || errorData.includes("does not exist")) || 
           errorData.message?.includes("not found") || errorData.message?.includes("does not exist"))) {
        console.log(`Saved campaign ${id} not found, treating as success`);
        
        // Return a fabricated success response
        return {
          status: 200,
          data: { message: "Campaign was not saved" },
          statusText: "OK",
          headers: {},
          config: error.config
        };
      }
      
      // If this isn't the "not found" case, try a fallback endpoint
      try {
        console.log(`First endpoint failed, trying fallback for campaign ID ${id}`);
        const fallbackResponse = await api.delete(`/campaigns/${id}/save`);
        console.log(`Successfully unsaved campaign ID ${id} using fallback endpoint`);
        return fallbackResponse;
      } catch (fallbackError: any) {
        // Log both errors for debugging
        console.error(`Error unsaving campaign ID ${id}:`, 
          error.name || 'Unknown error',
          error.message || '',
          error.response ? `Status: ${error.response.status}` : '',
          error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '',
          `Fallback error:`,
          fallbackError.message || 'Unknown');
        
        // Create a better user-facing error message
        const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Unable to remove from server, but it's been removed locally.";
        
        // Since we've already updated localStorage, we can return a fabricated success
        // but with a flag indicating it was only removed locally
        return {
          status: 200,
          data: { 
            message: "Campaign removed locally only", 
            localOnly: true,
            campaignId: numericId
          },
          statusText: "OK",
          headers: {},
          config: error.config || {}
        };
      }
    }
  },

  getSavedCampaigns: async () => {
    // Check if token exists for debugging
    const token = localStorage.getItem("token");
    console.log("DEBUG: Token available for saved campaigns request:", !!token);
    
    // Always use local storage as a fallback
    const localIds = getLocalSavedCampaigns();
    console.log("Local storage saved campaigns:", localIds);
    
    // Create a user-friendly success response with the local data
    const createLocalResponse = () => {
      console.log(`Using ${localIds.length} saved campaigns from localStorage`);
      return { 
        data: localIds.map(id => ({ 
          id, 
          campaignId: id,
          localOnly: true 
        })),
        localOnly: true
      };
    };
    
    try {
      // Define a single endpoint to avoid console errors with multiple failing attempts
      const endpoint = "/saved-campaigns/my";
      console.log(`Fetching saved campaigns using endpoint: ${endpoint}`);
      
      // Attempt to fetch from the backend
      const response = await api.get(endpoint);
      console.log(`Successfully fetched saved campaigns, found ${response.data?.length || 0} items`);
      
      // Update localStorage with the latest from server
      const campaignIds = response.data.map((item: any) => {
        if (item && item.campaign && item.campaign.id) {
          return item.campaign.id;
        }
        if (item && item.campaignId) {
          return item.campaignId;
        }
        if (item && typeof item.id === 'number') {
          return item.id;
        }
        return null;
      }).filter(Boolean);
      
      if (campaignIds.length > 0) {
        saveLocalCampaigns(campaignIds);
      }
      
      return response;
    } catch (error: any) {
      console.error(`Error fetching saved campaigns:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '');
      
      // Just return the local data - avoid multiple failed API calls
      return createLocalResponse();
    }
  },

  // New: upload image and get preview URL
  uploadImagePreview: async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          resolve(e.target.result)
        } else {
          reject("Failed to read image file")
        }
      }
      reader.onerror = () => reject("Failed to read image file")
      reader.readAsDataURL(file)
    })
  },
}

// Application services
export const applicationService = {
  getApplications: async (params: any = {}) => {
    console.log("%c APPLICATIONS API CALL", "background: orange; color: black", {
      params,
      API_URL,
      token: localStorage.getItem("token") ? "exists" : "missing"
    });
    
    try {
      // Use the unified endpoint
      const response = await api.get("/applications", { params });
      console.log(`Successfully fetched applications:`, response.data);
      return response;
    } catch (error: any) {
      console.error(`Error fetching applications:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '',
        error.response?.data || '');
      
      // Return empty data to prevent UI errors
      return { 
        data: [],
        error: true,
        errorMessage: "Failed to fetch applications. Using empty dataset."
      };
    }
  },

  // For backward compatibility - uses the main endpoint
  getAllApplications: async () => {
    console.log("Calling getAllApplications() (redirecting to main endpoint)");
    return applicationService.getApplications();
  },

  getApplication: async (id: string) => {
    try {
      console.log(`Fetching application details for ID ${id}`);
      const response = await api.get(`/applications/${id}`);
      return response;
    } catch (error: any) {
      console.error(`Error fetching application ${id}:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '',
        error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '');
      throw error;
    }
  },

  createApplication: async (applicationData: any) => {
    try {
      const endpoint = `/applications/apply/${applicationData.campaignId}`;
      console.log(`Creating application using endpoint: ${endpoint}`);
      const response = await api.post(endpoint, {});
      console.log(`Successfully created application`);
      return response;
    } catch (error: any) {
      console.error(`Error creating application:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '',
        error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '');
      
      // Create a better user-facing error message
      const errorMessage = error?.response?.data?.message || 
                        error?.response?.data || 
                        "Unable to apply to this campaign. The application feature might be temporarily unavailable.";
      
      // Rethrow with better message
      error.userMessage = errorMessage;
      throw error;
    }
  },

  updateApplicationStatus: async (id: string, status: string) => {
    try {
      console.log(`Updating application ${id} status to ${status}`);
      const response = await api.put(`/applications/${id}/status?status=${status}`);
      console.log(`Successfully updated application status to ${status}`);
      return response;
    } catch (error: any) {
      console.error(`Error updating application status:`, 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '',
        error.response?.data ? `Data: ${JSON.stringify(error.response.data)}` : '');
      
      // Create a fallback object to handle errors gracefully
      return {
        status: 500,
        data: { 
          message: "Error updating status. Please try again.",
          error: true
        }
      };
    }
  },
}

// Mock data for conversations
const MOCK_CONVERSATIONS_KEY = 'brandconnect_mock_conversations';
const MOCK_MESSAGES_KEY = 'brandconnect_mock_messages';

// Add proper interfaces for the message service
interface MockMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MockConversation {
  id: string;
  otherUser?: {
    id: string;
    name?: string;
    avatar?: string;
    online?: boolean;
  };
  recipient?: {
    id: string;
    name?: string;
    avatar?: string;
    online?: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  unread?: boolean;
}

// Helper functions for mock data
const getMockConversations = (): MockConversation[] => {
  try {
    const data = localStorage.getItem(MOCK_CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading mock conversations:", e);
    return [];
  }
};

const saveMockConversations = (conversations: MockConversation[]): void => {
  try {
    localStorage.setItem(MOCK_CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error("Error saving mock conversations:", e);
  }
};

const getMockMessages = (): Record<string, MockMessage[]> => {
  try {
    const data = localStorage.getItem(MOCK_MESSAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Error reading mock messages:", e);
    return {};
  }
};

const saveMockMessages = (messages: Record<string, MockMessage[]>): void => {
  try {
    localStorage.setItem(MOCK_MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving mock messages:", e);
  }
};

// Message services - Uses local storage for now since backend API is not available
export const messageService = {
  getConversations: async () => {
    return api.get("/conversations");
  },

  getConversation: async (id: string) => {
    return api.get(`/conversations/${id}`);
  },

  sendMessage: async (conversationId: string, content: string) => {
    // The backend expects a POST to /conversations/{id}/messages with content as a request param
    return api.post(`/conversations/${conversationId}/messages`, null, { params: { content } });
  },

  createConversation: async (recipientId: string, initialMessage: string) => {
    // The backend expects a POST to /conversations with recipientId and initialMessage as request params
    return api.post(`/conversations`, null, { params: { recipientId, initialMessage } });
  },
};

// Statistics services
export const statisticsService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  },

  getBrandStats: async () => {
    try {
      const response = await api.get("/dashboard/brand");
      return response.data;
    } catch (error) {
      console.error("Error fetching brand stats:", error);
      return null;
    }
  },

  getCreatorStats: async () => {
    try {
      const response = await api.get("/dashboard/creator");
      return response.data;
    } catch (error) {
      console.error("Error fetching creator stats:", error);
      return null;
    }
  },

  getCampaignStats: async (campaignId: string) => {
    try {
      const response = await api.get(`/statistics/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign stats for ID ${campaignId}:`, error);
      return null;
    }
  },

  getPerformanceStats: async () => {
    try {
      const response = await api.get("/dashboard/performance");
      return response.data;
    } catch (error) {
      console.error("Error fetching performance stats:", error);
      // Return default empty stats on error
      return {
        profileViews: { total: 0, change: 0 },
        campaignsApplied: { total: 0, change: 0 },
        acceptanceRate: { total: 0, change: 0 },
        earnings: { total: 0, change: 0 },
        campaignViews: { total: 0, change: 0 },
        applications: { total: 0, change: 0 },
        conversionRate: { total: 0, change: 0 },
        activeCampaigns: { total: 0, change: 0 }
      };
    }
  }
}

// Profile view services
export const profileViewService = {
  trackProfileView: async (creatorId: string, applicationId?: string) => {
    try {
      console.log("Tracking profile view for creator:", creatorId);
      const params: any = { creatorId };
      if (applicationId) {
        params.applicationId = applicationId;
      }
      
      // Add more detailed debug logging
      console.log("Making API request to track profile view with params:", params);
      
      // Fix the endpoint URL and add error handling
      const response = await api.post("/profile-views/track", null, { params });
      console.log("Profile view tracking successful:", response.data);
      return response;
    } catch (error: any) {
      console.error("Profile view tracking failed:", 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '');
        
      // Return a graceful failure object to prevent UI errors
      return {
        status: 200,
        data: { 
          message: "Profile view tracking failed but continuing", 
          error: true,
          handled: true
        }
      };
    }
  },

  getProfileViewStats: async () => {
    try {
      console.log("Fetching profile view stats");
      const response = await api.get("/profile-views/stats");
      console.log("Profile view stats:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching profile view stats:", 
        error.name || 'Unknown error',
        error.message || '',
        error.response ? `Status: ${error.response.status}` : '');
      
      // Return default stats on error  
      return {
        totalViews: 0,
        lastWeekViews: 0,
        previousWeekViews: 0,
        percentChange: 0
      };
    }
  }
};

export default api
