import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  decreaseCart as decreaseCartService,
  deleteCart as deleteCartService,
  getCart,
} from "../services/cartService";

type CartItem = {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
};

export default function AddtoCartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    try {
      const result = await getCart();
      setCart(result.data || []);
    } catch (error) {
      console.error("GET CART ERROR:", error);
      alert("Gagal mengambil cart");
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function increaseCart(productId: number) {
    try {
      setIsLoading(true);
      await addToCart(productId, 1);
      await loadCart();
    } catch (error) {
      console.error("INCREASE CART ERROR:", error);
      alert("Gagal menambah quantity");
    } finally {
      setIsLoading(false);
    }
  }

  async function decreaseCart(item: CartItem) {
    try {
      setIsLoading(true);

      if (item.quantity === 1) {
        await deleteCartService(item.id);
      } else {
        await decreaseCartService(item.id);
      }

      await loadCart();
    } catch (error) {
      console.error("DECREASE CART ERROR:", error);
      alert("Gagal mengurangi cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function checkout() {
    try {
      setIsLoading(true);
      navigate("/checkout");
    } finally {
      setIsLoading(false);
    }
  }

  const grandTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 cursor-pointer rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-800"
        >
          Back to Home
        </button>

        <h1 className="mb-6 text-4xl font-bold text-slate-800">My Cart</h1>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow">
            <p className="text-slate-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.productName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Total: Rp {item.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={isLoading}
                    onClick={() => decreaseCart(item)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="min-w-[40px] text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    disabled={isLoading}
                    onClick={() => increaseCart(item.productId)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
            disabled={isLoading || cart.length === 0}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={checkout}
          >
            {isLoading
              ? "Processing..."
              : cart.length === 0
                ? "Cart is empty"
                : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}