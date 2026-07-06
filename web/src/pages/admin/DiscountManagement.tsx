import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Tag, Pencil, Trash2, Power } from "lucide-react";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
  type Discount,
  type DiscountPayload,
} from "../../services/discountService";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<DiscountPayload>({
    name: "",
    type: "PERCENTAGE",
    scope: "PRODUCT",
    value: 0,
    storeId: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getDiscounts(1, 50, undefined, search);
      setDiscounts(res.discounts ?? []);
    } catch {
      setError("Failed to fetch discounts");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleAdd = () => {
    setEditingDiscount(null);
    setForm({
      name: "",
      type: "PERCENTAGE",
      scope: "PRODUCT",
      value: 0,
      storeId: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setForm({
      name: discount.name,
      description: discount.description,
      type: discount.type,
      scope: discount.scope,
      value: discount.value,
      minValue: discount.minValue,
      maxValue: discount.maxValue,
      productId: discount.productId,
      storeId: discount.storeId,
      startDate: discount.startDate.split("T")[0],
      endDate: discount.endDate.split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, form);
      } else {
        await createDiscount(form);
      }
      setIsModalOpen(false);
      fetchDiscounts();
    } catch {
      setError("Failed to save discount");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDiscount(deleteTarget.id);
      setDeleteTarget(null);
      fetchDiscounts();
    } catch {
      setError("Failed to delete discount");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (discount: Discount) => {
    try {
      await toggleDiscountStatus(discount.id);
      fetchDiscounts();
    } catch {
      setError("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Discount Management</h1>
          <p className="text-sm text-gray-400">Manage promotions and discounts</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Discount
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); fetchDiscounts(); }} className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search discounts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Scope</th>
                <th className="px-5 py-3 text-left">Value</th>
                <th className="px-5 py-3 text-left">Period</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Tag size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">No discounts found</p>
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{discount.name}</td>
                    <td className="px-5 py-3 text-gray-500">{discount.type}</td>
                    <td className="px-5 py-3 text-gray-500">{discount.scope}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {discount.type === "PERCENTAGE" ? `${discount.value}%` : `Rp ${discount.value.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(discount.startDate).toLocaleDateString("id-ID")} - {new Date(discount.endDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${discount.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {discount.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleToggle(discount)} className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg" title="Toggle">
                          <Power size={15} />
                        </button>
                        <button onClick={() => handleEdit(discount)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(discount)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800">{editingDiscount ? "Edit Discount" : "Add Discount"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DiscountPayload["type"] })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="NOMINAL">Nominal</option>
                    <option value="BOGO">BOGO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                  <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as DiscountPayload["scope"] })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="PRODUCT">Product</option>
                    <option value="TRANSACTION">Transaction</option>
                    <option value="SHIPPING">Shipping</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value {form.type === "PERCENTAGE" ? "(%)" : "(Rp)"}</label>
                <input type="number" required min={0} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{editingDiscount ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          submitting={isDeleting}
          title="Delete Discount"
        />
      )}
    </div>
  );
}