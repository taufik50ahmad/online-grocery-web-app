// web/src/pages/admin/InventoryManagement.tsx
import { useState, useEffect, useCallback } from "react";
import { Search, Package, History, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  getStocks,
  getStockJournals,
  adjustStock,
  type Stock,
  type StockJournal,
  type StockAdjustmentPayload,
} from "../../services/stockService";
import { getProducts } from "../../services/productService";
import { getStores } from "../../services/storeService";
import type { Product } from "../../types";

interface Store {
  id: number;
  name: string;
}

function getAdminInfo(): { role: string; id?: number; storeId?: number } {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { role: "" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role || "",
      id: payload.id,
      storeId: payload.storeId,
    };
  } catch {
    return { role: "" };
  }
}

export default function InventoryManagement() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [journals, setJournals] = useState<StockJournal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"stocks" | "journals">("stocks");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number>(1);

  const adminInfo = getAdminInfo();
  const role = adminInfo.role;
  const isSuperAdmin = role === "SUPER_ADMIN";

  const [adjustForm, setAdjustForm] = useState<StockAdjustmentPayload>({
    productId: 0,
    storeId: 1,
    type: "IN",
    quantity: 0,
    note: "",
  });

  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStocks(1, 50, selectedStoreId, search);
      setStocks(res.stocks ?? []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch stocks";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStoreId]);

  const fetchJournals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStockJournals(1, 50, selectedStoreId);
      setJournals(res.journals ?? []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch journals";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreId]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts(1, 100);
      setProducts(res.products ?? []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch products";
      toast.error(msg);
    }
  }, []);

  const fetchStores = useCallback(async () => {
    try {
      const data = await getStores();
      const storeList = data.stores ?? data ?? [];
      setStores(storeList);
      if (storeList.length > 0) {
        // For STORE_ADMIN, prefer their own store; otherwise first store
        const initialStoreId = !isSuperAdmin && adminInfo.storeId
          ? adminInfo.storeId
          : storeList[0].id;
        setSelectedStoreId(initialStoreId);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch stores";
      toast.error(msg);
    }
  }, [adminInfo.storeId, isSuperAdmin]);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, [fetchProducts, fetchStores]);

  useEffect(() => {
    if (activeTab === "stocks") fetchStocks();
    else fetchJournals();
  }, [activeTab, fetchStocks, fetchJournals]);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adjustStock({
        ...adjustForm,
        storeId: selectedStoreId,
      });
      toast.success("Stock adjusted successfully");
      setIsModalOpen(false);
      fetchStocks();
      setAdjustForm({ productId: 0, storeId: selectedStoreId, type: "IN", quantity: 0, note: "" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to adjust stock";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-sm text-gray-400">
            Track and manage stock levels
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Adjust Stock
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Store selector for super admin */}
      {isSuperAdmin && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Store:</label>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stores.length === 0 ? (
              <option value={1}>Store #1</option>
            ) : (
              stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("stocks")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "stocks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package size={16} />
          Stock Levels
        </button>
        <button
          onClick={() => setActiveTab("journals")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "journals"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <History size={16} />
          Journal History
        </button>
      </div>

      {activeTab === "stocks" && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchStocks();
            }}
            className="relative"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stocks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Product</th>
                    <th className="px-5 py-3 text-left">Store</th>
                    <th className="px-5 py-3 text-left">Quantity</th>
                    <th className="px-5 py-3 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : stocks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                        No stocks found
                      </td>
                    </tr>
                  ) : (
                    stocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">
                          {stock.product?.name ?? `Product #${stock.productId}`}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {stock.store?.name ?? `Store #${stock.storeId}`}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`font-medium ${
                              stock.quantity > 10
                                ? "text-green-600"
                                : stock.quantity > 0
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {stock.quantity} {stock.product?.unit ?? ""}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">
                          {new Date(stock.updatedAt).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "journals" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Quantity</th>
                  <th className="px-5 py-3 text-left">Note</th>
                  <th className="px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : journals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No journal entries
                    </td>
                  </tr>
                ) : (
                  journals.map((journal) => (
                    <tr key={journal.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {journal.product?.name ?? `Product #${journal.productId}`}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            journal.type === "IN"
                              ? "bg-green-50 text-green-600"
                              : journal.type === "OUT"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {journal.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {journal.quantity}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {journal.note ?? "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(journal.createdAt).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Adjust Stock</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAdjust} className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  required
                  value={adjustForm.productId || ""}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      productId: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={adjustForm.type}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      type: e.target.value as "IN" | "OUT" | "ADJUSTMENT",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IN">Stock In (+)</option>
                  <option value="OUT">Stock Out (-)</option>
                  <option value="ADJUSTMENT">Adjustment (=)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustForm.quantity || ""}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  value={adjustForm.note}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, note: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional note"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}