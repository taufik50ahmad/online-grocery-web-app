import axios from "axios";

const API_BASE_URL = "http://localhost:9000";
const API_URL = `${API_BASE_URL}/api/stores`;

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getStores() {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function getPublicStores() {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
}

export async function createStore(data: {
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
}) {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function updateStore(
  id: number,
  data: {
    name?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function registerMyStore(data: {
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
}) {
  const response = await axios.post(`${API_URL}/register-my-store`, data, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function deleteStore(id: number) {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function assignStoreAdmin(storeId: number, userId: number) {
  const response = await axios.post(
    `${API_URL}/${storeId}/assign-admin`,
    {
      userId,
    },
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
}