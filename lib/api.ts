const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'; // Flask base URL

// ---- Type Definitions ----
type UserData = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  password: string;
  role: 'consumer' | 'donor' | 'ngo';
};

type AuthResponse = {
  status: string;
  message: string;
  data?: {
    user_id: number;
    role: string;
    token?: string;
  };
  error?: string;
};

type ProfileData = {
  user_id: number;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  role: string;
  profile_picture?: string;
  created_at: string;
};

type ProfileResponse = {
  status: string;
  message: string;
  data?: ProfileData;
  error?: string;
};

type UpdateProfileData = {
  full_name?: string;
  phone_number?: string;
  address?: string;
};

// ---- Register User ----
export async function register(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: 'consumer' | 'donor' | 'ngo';
}): Promise<AuthResponse> {
  const userData: UserData = {
    full_name: data.name,
    email: data.email,
    phone_number: data.phone,
    address: data.address,
    password: data.password,
    role: data.role
  };

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Registration failed");
  }

  return {
    status: 'success',
    message: responseData.message,
    data: responseData
  };
}

// ---- Login ----
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return {
    status: 'success',
    message: data.message,
    data: data
  };
}

// ---- Get Profile ----
export async function getProfile(userId: number, token: string): Promise<ProfileResponse> {
  const res = await fetch(`${API_URL}/user/profile/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch profile");
  }

  return {
    status: 'success',
    message: data.message,
    data: data.data
  };
}

// ---- Update Profile ----
export async function updateProfile(
  userId: number,
  token: string,
  profileData: {
    name?: string;
    phone?: string;
    address?: string;
  }
): Promise<ProfileResponse> {
  const updateData: UpdateProfileData = {};
  if (profileData.name) updateData.full_name = profileData.name;
  if (profileData.phone) updateData.phone_number = profileData.phone;
  if (profileData.address) updateData.address = profileData.address;

  const res = await fetch(`${API_URL}/user/update/${userId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update profile");
  }

  return {
    status: 'success',
    message: data.message,
    data: data.data
  };
}

// ---- Upload Profile Picture ----
export async function uploadProfilePicture(
  userId: number,
  token: string,
  file: File
): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append('profile_picture', file);

  const res = await fetch(`${API_URL}/user/upload-profile-picture/${userId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to upload profile picture");
  }

  return {
    status: 'success',
    message: data.message,
    data: data.data
  };
}

// ---- Generic GET ----
export async function fetchData(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
  return response.json();
}

// ---- Error Helper ----
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
