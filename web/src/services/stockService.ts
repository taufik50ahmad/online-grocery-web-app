import api from "./api";

export interface Stock {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
  product?: { id: number; name: string; unit: string };
  store?: { id: number; name: string };
  updatedAt: string;
}

export interface StockJournal {
  id: number;
  stockId: number;
  productId: number;
  storeId: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  note?: string;
  createdAt: string;
  product?: { id: number; name: string; unit: string };
  store?: { id: number; name: string };
  user?: { id: number; name: string };
}

export interface StockAdjustmentPayload {
  productId: number;
  storeId: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  note?: string;
}

export const getStocks = async (
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
  const res = await api.get(`/stocks?${params}`);
  return res.data;
};

export const getStockJournals = async (
  page = 1,
  limit = 10,
  storeId?: number,
  productId?: number,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(storeId && { storeId: String(storeId) }),
    ...(productId && { productId: String(productId) }),
  });
  const res = await api.get(`/stocks/journals?${params}`);
  return res.data;
};

export const adjustStock = async (payload: StockAdjustmentPayload) => {
  const res = await api.post("/stocks/adjust", payload);
  return res.data;
};