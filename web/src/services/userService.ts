import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getAllUsers() {
  const res = await axios.get(`${BASE_URL}/api/users`, {
    headers: getHeaders(),
  });
  return res.data.data;
}

export async function getAllStoreAdmins() {
  const res = await axios.get(`${BASE_URL}/api/users/store-admins`, {
    headers: getHeaders(),
  });
  return res.data.data;
}

export async function createStoreAdmin(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await axios.post(`${BASE_URL}/api/users/store-admins`, payload, {
    headers: getHeaders(),
  });
  return res.data.data;
}

export async function updateStoreAdmin(
  id: string,
  payload: { name?: string; email?: string; password?: string },
) {
  const res = await axios.put(
    `${BASE_URL}/api/users/store-admins/${id}`,
    payload,
    { headers: getHeaders() },
  );
  return res.data.data;
}

export async function deleteStoreAdmin(id: string) {
  const res = await axios.delete(`${BASE_URL}/api/users/store-admins/${id}`, {
    headers: getHeaders(),
  });
  return res.data;
}

export const userService = {
  getAllUsers,
  getAllStoreAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
};
