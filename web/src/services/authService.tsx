import axios from "axios";

const API_URL = "http://localhost:9000/api/auth";

export async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
}

export async function registerUser(name: string, email: string) {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
  });

  return response.data;
}

export async function getProfile() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function verifyEmail(token: string, password: string) {
  const response = await axios.post(`${API_URL}/verify-email`, {
    token,
    password,
  });

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email,
  });

  return response.data;
}

export async function resetPassword(token: string, password: string) {
  const response = await axios.post(`${API_URL}/reset-password`, {
    token,
    password,
  });

  return response.data;
}

export async function resendVerificationEmail(email: string) {
  const response = await axios.post(`${API_URL}/resend-verification`, {
    email,
  });

  return response.data;
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  profilePicture?: string;
}) {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function registerStoreAdmin() {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/register-store-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function loginWithGoogle(idToken: string) {
  const response = await axios.post(`${API_URL}/google`, {
    idToken,
  });

  return response.data;
}