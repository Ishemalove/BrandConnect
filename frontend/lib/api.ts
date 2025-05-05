import { LoginRequest, RegisterRequest, AuthResponse } from './types';

const API_URL = 'http://localhost:8080/api';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const responseData = await response.json();
    return { token: responseData.token };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: data.role,
        name: data.name,
        email: data.email,
        password: data.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const responseData = await response.json();
    return { token: responseData.token };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
}

// Helper to get auth headers
function getAuthHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Campaigns
export async function getCampaigns(token: string) {
  const res = await fetch(`${API_URL}/campaigns`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function getCampaign(token: string, id: number) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch campaign');
  return res.json();
}

export async function createCampaign(token: string, data: any) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create campaign');
  return res.json();
}

export async function updateCampaign(token: string, id: number, data: any) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update campaign');
  return res.json();
}

export async function deleteCampaign(token: string, id: number) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete campaign');
  return res.json();
}

// Applications
export async function applyToCampaign(token: string, campaignId: number) {
  const res = await fetch(`${API_URL}/applications/apply/${campaignId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to apply to campaign');
  return res.json();
}

export async function getMyApplications(token: string) {
  const res = await fetch(`${API_URL}/applications/my`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
}

export async function getApplicationsForCampaign(token: string, campaignId: number) {
  const res = await fetch(`${API_URL}/applications/campaign/${campaignId}`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
}

export async function updateApplicationStatus(token: string, appId: number, status: string) {
  const res = await fetch(`${API_URL}/applications/${appId}/status?status=${status}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to update application status');
  return res.json();
}

// Saved Campaigns
export async function saveCampaign(token: string, campaignId: number) {
  const res = await fetch(`${API_URL}/saved-campaigns/save/${campaignId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to save campaign');
  return res.json();
}

export async function unsaveCampaign(token: string, campaignId: number) {
  const res = await fetch(`${API_URL}/saved-campaigns/unsave/${campaignId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to unsave campaign');
  return res.json();
}

export async function getMySavedCampaigns(token: string) {
  const res = await fetch(`${API_URL}/saved-campaigns/my`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch saved campaigns');
  return res.json();
}

// Dashboard Stats
export async function getDashboardStats(token: string) {
  const res = await fetch(`${API_URL}/dashboard/stats`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

// Recommendations
export async function getRecommendations(token: string) {
  const res = await fetch(`${API_URL}/recommendations`, { headers: getAuthHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
} 