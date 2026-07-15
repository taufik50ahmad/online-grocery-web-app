import api from "./api";

export async function getAllUsers() {
  const res = await api.get("/users");
  return res.data.data;
}

export async function getAllStoreAdmins() {
  const res = await api.get("/users/store-admins");
  return res.data.data;
}

export async function createStoreAdmin(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/users/store-admins", payload);
  return res.data.data;
}

export async function updateStoreAdmin(
  id: number,
  payload: { name?: string; email?: string; password?: string },
) {
  const res = await api.put(`/users/store-admins/${id}`, payload);
  return res.data.data;
}

export async function deleteStoreAdmin(id: number) {
  const res = await api.delete(`/users/store-admins/${id}`);
  return res.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.put("/auth/change-password", payload);
  return res.data;
}

export const userService = {
  getAllUsers,
  getStoreAdmins: getAllStoreAdmins,
  getAllStoreAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
  changePassword,
};
