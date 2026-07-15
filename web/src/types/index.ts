export interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "STORE_ADMIN" | "CUSTOMER";
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
  categoryId?: number;
  category?: Category;
  images: ProductImage[];
  stocks?: Stock[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  imageUrl: string;
  productId: number;
  isPrimary: boolean;
  order: number;
}

export interface Stock {
  id: number;
  productId: number;
  storeId: number;
  store?: Store;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}