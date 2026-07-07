import api from "./api";
import type { Category, ApiResponse, PaginatedResponse } from "../types";

export interface CategoryPayload {
  name: string;
}

export const getAllCategories = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<PaginatedResponse<Category>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
  });
  const res = await api.get(`/categories?${params}`);
  return res.data;
};

export const createCategory = async (
  payload: CategoryPayload,
): Promise<ApiResponse<Category>> => {
  const res = await api.post("/categories", payload);
  return res.data;
};

export const updateCategory = async (
  id: string,
  payload: CategoryPayload,
): Promise<ApiResponse<Category>> => {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
