// web/src/components/admin/DiscountTable.tsx
import { Tag, Power, Pencil, Trash2 } from "lucide-react";
import type { Discount } from "../../services/discountService";

interface DiscountTableProps {
  discounts: Discount[];
  isLoading: boolean;
  onToggle: (discount: Discount) => void;
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
}

export default function DiscountTable({
  discounts,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
}: DiscountTableProps) {
  return (
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
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
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
                    {discount.type === "PERCENTAGE"
                      ? `${discount.value}%`
                      : `Rp ${discount.value.toLocaleString("id-ID")}`}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(discount.startDate).toLocaleDateString("id-ID")} -{" "}
                    {new Date(discount.endDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        discount.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {discount.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onToggle(discount)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg"
                        title="Toggle"
                      >
                        <Power size={15} />
                      </button>
                      <button
                        onClick={() => onEdit(discount)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(discount)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
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
  );
}