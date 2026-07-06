import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";
import {
  getSalesReport,
  getSalesByCategoryReport,
  getSalesByProductReport,
  getStockSummaryReport,
} from "../../services/reportService";

export default function ReportAnalysis() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activeTab, setActiveTab] = useState<"sales" | "stock">("sales");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [salesData, setSalesData] = useState<{
    totalRevenue: number;
    totalOrders: number;
  } | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (activeTab === "sales") {
        const [sales, categories, products] = await Promise.all([
          getSalesReport(year, month),
          getSalesByCategoryReport(year, month),
          getSalesByProductReport(year, month),
        ]);
        setSalesData({
          totalRevenue: sales.totalRevenue ?? 0,
          totalOrders: sales.totalOrders ?? 0,
        });
        setCategoryData(categories.data ?? []);
        setProductData(products.data ?? []);
      } else {
        const stock = await getStockSummaryReport(year, month);
        setStockData(stock.data ?? []);
      }
    } catch {
      setError("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, year, month]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Report & Analysis</h1>
        <p className="text-sm text-gray-400">Sales and stock performance insights</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "sales" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            <TrendingUp size={16} /> Sales
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "stock" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            <Package size={16} /> Stock
          </button>
        </div>
        <div className="flex gap-2 ml-auto">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[now.getFullYear(), now.getFullYear() - 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ) : activeTab === "sales" ? (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {(salesData?.totalRevenue ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{salesData?.totalOrders ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Sales by Category</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Category</th>
                    <th className="px-5 py-3 text-left">Revenue</th>
                    <th className="px-5 py-3 text-left">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoryData.length === 0 ? (
                    <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">No data</td></tr>
                  ) : (
                    categoryData.map((cat, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">{cat.categoryName}</td>
                        <td className="px-5 py-3 text-gray-700">Rp {cat.totalRevenue.toLocaleString("id-ID")}</td>
                        <td className="px-5 py-3 text-gray-500">{cat.totalOrders}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales by Product */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Sales by Product</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Product</th>
                    <th className="px-5 py-3 text-left">Revenue</th>
                    <th className="px-5 py-3 text-left">Quantity Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productData.length === 0 ? (
                    <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">No data</td></tr>
                  ) : (
                    productData.map((prod, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">{prod.productName}</td>
                        <td className="px-5 py-3 text-gray-700">Rp {prod.totalRevenue.toLocaleString("id-ID")}</td>
                        <td className="px-5 py-3 text-gray-500">{prod.totalQuantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Stock Report */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Stock Summary - {months[month - 1]} {year}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Total In</th>
                  <th className="px-5 py-3 text-left">Total Out</th>
                  <th className="px-5 py-3 text-left">Final Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockData.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No data</td></tr>
                ) : (
                  stockData.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{item.productName}</td>
                      <td className="px-5 py-3 text-green-600">+{item.totalIn}</td>
                      <td className="px-5 py-3 text-red-600">-{item.totalOut}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{item.finalStock} {item.unit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}