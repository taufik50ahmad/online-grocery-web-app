import api from "./api";
import type { Product, ApiResponse } from "../types";

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit?: string;
  categoryId?: number;
  images?: { imageUrl: string; isPrimary?: boolean; order?: number }[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getProducts = async (
  page = 1,
  limit = 10,
  search = "",
  categoryId?: number,
): Promise<ProductListResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
    ...(categoryId && { categoryId: String(categoryId) }),
  });
  const res = await api.get(`/products?${params}`);
  return res.data;
};

export const getProductById = async (id: number): Promise<ApiResponse<Product>> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (
  payload: ProductPayload,
): Promise<ApiResponse<Product>> => {
  const res = await api.post("/products", payload);
  return res.data;
};

export const updateProduct = async (
  id: number,
  payload: Partial<ProductPayload>,
): Promise<ApiResponse<Product>> => {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const toggleProductStatus = async (
  id: number,
): Promise<ApiResponse<Product>> => {
  const res = await api.patch(`/products/${id}/toggle`);
  return res.data;
};