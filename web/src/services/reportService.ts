import api from "./api";

export const getSalesReport = async (year: number, month: number, storeId?: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    ...(storeId && { storeId: String(storeId) }),
  });
  const res = await api.get(`/reports/sales?${params}`);
  return res.data;
};

export const getSalesByCategoryReport = async (year: number, month: number, storeId?: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    ...(storeId && { storeId: String(storeId) }),
  });
  const res = await api.get(`/reports/sales/category?${params}`);
  return res.data;
};

export const getSalesByProductReport = async (year: number, month: number, storeId?: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    ...(storeId && { storeId: String(storeId) }),
  });
  const res = await api.get(`/reports/sales/product?${params}`);
  return res.data;
};

export const getStockSummaryReport = async (year: number, month: number, storeId?: number) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    ...(storeId && { storeId: String(storeId) }),
  });
  const res = await api.get(`/reports/stock/summary?${params}`);
  return res.data;
};

export const getStockDetailReport = async (
  year: number,
  month: number,
  storeId?: number,
  productId?: number,
  page = 1,
  limit = 10,
) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    page: String(page),
    limit: String(limit),
    ...(storeId && { storeId: String(storeId) }),
    ...(productId && { productId: String(productId) }),
  });
  const res = await api.get(`/reports/stock/detail?${params}`);
  return res.data;
};