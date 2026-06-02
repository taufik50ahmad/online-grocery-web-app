import type { Store } from "../types/store";

export const defaultStoreId = 1;

export const stores: Store[] = [
  {
    id: 1,
    name: "FreshMart Tangerang Utama",
    address: "Jl. Jend. Sudirman, Tangerang",
    latitude: -6.178306,
    longitude: 106.631889,
    maxServiceDistanceKm: 12,
  },
  {
    id: 2,
    name: "FreshMart Jakarta Barat",
    address: "Jl. Daan Mogot, Jakarta Barat",
    latitude: -6.16743,
    longitude: 106.763725,
    maxServiceDistanceKm: 10,
  },
  {
    id: 3,
    name: "FreshMart Bekasi Kota",
    address: "Jl. Ahmad Yani, Bekasi",
    latitude: -6.23827,
    longitude: 106.975571,
    maxServiceDistanceKm: 10,
  },
];
