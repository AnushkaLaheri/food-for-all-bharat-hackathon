import axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions
type UserData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: 'consumer' | 'donor' | 'ngo';
};

type AuthResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
};

type Donation = {
  id: string;
  food_item: string;
  quantity: number;
  expiry_date: string;
  status: 'available' | 'reserved' | 'claimed';
  donor_id: string;
  created_at: string;
  updated_at: string;
  // Add other donation fields as needed
};

type FoodItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry_date: string;
  status: 'available' | 'reserved' | 'claimed';
  // Add other food item fields as needed
};

type Request = {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  ngo_id: string;
  donation_id: string;
  quantity_requested: number;
  created_at: string;
  // Add other request fields as needed
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

// Auth functions
export const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
    throw new Error('An unknown error occurred during registration');
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
    throw new Error('An unknown error occurred during login');
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
    throw new Error('An unknown error occurred during token refresh');
  }
};

export const getProfile = async (token: string): Promise<{
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}> => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
    throw new Error('An unknown error occurred while fetching profile');
  }
};

// Donation functions
export const createDonation = async (
  token: string,
  donationData: {
    food_item: string;
    quantity: number;
    expiry_date: string;
    description?: string;
  }
): Promise<Donation> => {
  try {
    const response = await axios.post<{ donation: Donation }>(
      `${API_URL}/donations`,
      donationData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data.donation;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create donation');
    }
    throw new Error('An unknown error occurred while creating donation');
  }
};

export const listDonations = async (
  token: string,
  filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<Donation>> => {
  try {
    const { status, page = 1, limit = 10 } = filters;
    const response = await axios.get<PaginatedResponse<Donation>>(
      `${API_URL}/donations`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          status,
          page,
          limit
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch donations');
    }
    throw new Error('An unknown error occurred while fetching donations');
  }
};

export const getDonationDetails = async (
  token: string,
  donationId: string
): Promise<Donation> => {
  try {
    const response = await axios.get<{ donation: Donation }>(
      `${API_URL}/donations/${donationId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data.donation;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch donation details');
    }
    throw new Error('An  unknown  error  occurred  while  fetching  donation  details');
  }
};

// Request functions
export const listPendingRequests = async (
  token: string,
  filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<Request>> => {
  try {
    const { status, page = 1, limit = 10 } = filters;
    const response = await axios.get<PaginatedResponse<Request>>(
      `${API_URL}/requests/pending`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          status,
          page,
          limit
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch requests');
    }
    throw new Error('An  unknown  error  occurred  while  fetching  requests');
  }
};

export const createRequest = async (
  token: string,
  requestData: {
    donation_id: string;
    quantity_requested: number;
    purpose: string;
  }
): Promise<Request> => {
  try {
    const response = await axios.post<{ request: Request }>(
      `${API_URL}/requests`,
      requestData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data.request;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create request');
    }
    throw new Error('An  unknown  error  occurred  while  creating  request');
  }
};

export const acceptRequest = async (
  token: string,
  requestId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/requests/${requestId}/accept`,
      {},
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to accept request');
    }
    throw new Error('An  unknown  error  occurred  while  accepting  request');
  }
};

// Consumer functions
export const fetchAvailableFoods = async (
  token: string,
  filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
): Promise<PaginatedResponse<FoodItem>> => {
  try {
    const { page = 1, limit = 10, search } = filters;
    const response = await axios.get<PaginatedResponse<FoodItem>>(
      `${API_URL}/food/available`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          page,
          limit,
          search
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available foods');
    }
    throw new Error('An  unknown  error  occurred  while  fetching  available  foods');
  }
};

// Utility function to extract error messages
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'API request failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Configure axios defaults
axios.interceptors.request.use(config => {
  // You can add request interceptors here if needed
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // You can add response interceptors here if needed
  return response;
}, error => {
  if (error.response?.status === 401) {
    // Handle token expiration or unauthorized access
    // You might want to redirect to login or refresh token
  }
  return Promise.reject(error);
});