export type UserRole = "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export interface StoreAdmin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "STORE_ADMIN";
  createdAt: string;
}

export interface CreateStoreAdminPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateStoreAdminPayload {
  name?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
