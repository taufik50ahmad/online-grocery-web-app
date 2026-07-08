import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./loading.css"

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
};

type Order = {
  id: number;
  userId: number;
  totalQuantity: number;
  orderStatus: string;
  orderItems: OrderItem[];
};

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const {orderId} = useParams()

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    fetch(`http://localhost:9000/orders/${orderId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setOrder(data.data);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">

      <div className="dots-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-slate-800">
        Loading Checkout
      </h2>

      <p className="mt-2 text-slate-500">
        Preparing your groceries...
      </p>

    </div>
  );
}

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          No pending checkout found.
        </h2>
      </div>
    );
  }

  const grandTotal = order.orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
  <button
    onClick={() => navigate("/cart")}
    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-100"
  >
    ← Back to Cart
  </button>
</div>
        <h1 className="mb-6 text-3xl font-bold">
          Checkout
        </h1>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <span className="font-medium">Order ID</span>
            <span>{order.id}</span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="font-medium">Status</span>
            <span className="font-semibold text-blue-600">
              {order.orderStatus}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="font-medium">Total Quantity</span>
            <span>{order.totalQuantity}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Total Price</th>
              </tr>
            </thead>

            <tbody>
              {order.orderItems.map((item) => (
                <tr
                  key={item.productId}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4">{item.productName}</td>

                  <td className="p-4">{item.quantity}</td>

                  <td className="p-4 font-semibold text-green-600">
                    Rp {item.totalPrice.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <div className="flex justify-between text-lg font-semibold">
            <span>Grand Total</span>

            <span className="text-green-600">
              Rp {grandTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate(`/placed-order/${order.id}`)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}