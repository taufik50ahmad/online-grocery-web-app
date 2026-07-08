// web/src/components/admin/StockTable.tsx
import type { Stock } from "../../services/stockService";

interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
}

export default function StockTable({ stocks, isLoading }: StockTableProps) {
  return (
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
  );
}