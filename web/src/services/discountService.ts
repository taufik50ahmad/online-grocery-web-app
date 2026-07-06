import api from "./api";

export interface Discount {
  id: number;
  name: string;
  description?: string;
  type: "PERCENTAGE" | "NOMINAL" | "BOGO";
  scope: "PRODUCT" | "TRANSACTION" | "SHIPPING";
  value: number;
  minValue?: number;
  maxValue?: number;
  productId?: number;
  storeId: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  product?: { id: number; name: string };
  store?: { id: number; name: string };
}

export interface DiscountPayload {
  name: string;
  description?: string;
  type: "PERCENTAGE" | "NOMINAL" | "BOGO";
  scope: "PRODUCT" | "TRANSACTION" | "SHIPPING";
  value: number;
  minValue?: number;
  maxValue?: number;
  productId?: number;
  storeId: number;
  startDate: string;
  endDate: string;
}

export const getDiscounts = async (
  page = 1,
  limit = 10,
  storeId?: number,
  search = "",
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(storeId && { storeId: String(storeId) }),
    ...(search && { search }),
  });
  const res = await api.get(`/discounts?${params}`);
  return res.data;
};

export const createDiscount = async (payload: DiscountPayload) => {
  const res = await api.post("/discounts", payload);
  return res.data;
};

export const updateDiscount = async (id: number, payload: Partial<DiscountPayload>) => {
  const res = await api.put(`/discounts/${id}`, payload);
  return res.data;
};

export const deleteDiscount = async (id: number) => {
  const res = await api.delete(`/discounts/${id}`);
  return res.data;
};

export const toggleDiscountStatus = async (id: number) => {
  const res = await api.patch(`/discounts/${id}/toggle`);
  return res.data;
};