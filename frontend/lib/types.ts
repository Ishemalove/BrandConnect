export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  role: "CREATOR" | "BRAND";
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
} 