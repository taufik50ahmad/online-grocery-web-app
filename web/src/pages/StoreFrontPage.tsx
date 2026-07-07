import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getProfile } from "../services/authService";
import { getStores } from "../services/storeService";
import { ProductManagement } from "../components/ProductManagement";

type Store = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  latitude: string | number;
  longitude: string | number;
  storeAdminId?: number | null;
};

type User = {
  id: number;
  email: string;
  role: "USER" | "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN" | "ADMIN";
};

export function StoreFrontPage() {
  const { storeId } = useParams();

  const [store, setStore] = useState<Store | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const storesResult = await getStores();
      const foundStore = storesResult.stores.find(
        (item: Store) => item.id === Number(storeId),
      );

      setStore(foundStore || null);

      try {
        const profileResult = await getProfile();
        setUser(profileResult.user);
      } catch {
        setUser(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal membuka store");
      } else {
        alert("Gagal membuka store");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [storeId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <p className="text-center text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow">
          <h1 className="text-xl font-bold text-red-600">Store not found</h1>

          <Link
            to="/store-management"
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white"
          >
            Back
          </Link>
        </div>
      </main>
    );
  }

  const canManageProduct =
    user?.role === "SUPER_ADMIN" || user?.role === "STORE_ADMIN";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-red-600">{store.name}</h1>

              <p className="mt-2 text-sm text-slate-600">
                {store.address || "-"} | {store.city || "-"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Lat: {String(store.latitude)} | Long: {String(store.longitude)}
              </p>
            </div>

            <Link
              to="/store-management"
              className="rounded bg-slate-700 px-4 py-2 text-sm text-white"
            >
              Back
            </Link>
          </div>
        </div>

        <ProductManagement canManageProduct={canManageProduct} />
      </div>
    </main>
  );
}
