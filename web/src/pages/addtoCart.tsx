import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

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

  const dummyProducts: Product[] = [
    {
      id: 1,
      name: "Ice Cream",
      price: 100000,
      quantity: 120,
    },
    {
      id: 2,
      name: "Liquid Soap",
      price: 10000,
      quantity: 10,
    },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/get/cart", {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();
      setCart(result.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    void fetchCart();
  }, []);

  async function addtoCart(product: Product) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:9000/add/cart", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCart(productId: number) {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:9000/cart/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function increaseCart(productId: number) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:9000/add/cart", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function decreaseCart(id: number) {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:9000/cart/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkout() {
  setIsLoading(true);

  try {
    const response = await fetch(
      "http://localhost:9000/checkout",
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );


    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }


    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message);
    }


    navigate(`/checkout/${data.data.id}`);


  } catch (error) {

    alert(error.message);

  } finally {

    setIsLoading(false);

  }
}

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-800"
        >
          Back to Home
        </button>

        <h1 className="mb-6 text-4xl font-bold text-slate-800">
          Grocery Store
        </h1>

        <h2 className="mb-4 text-2xl font-semibold">Products</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {dummyProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-5 shadow-md"
            >
              <h3 className="text-xl font-semibold">{product.name}</h3>

              <p className="mt-2 text-lg font-bold text-green-600">
                Rp {product.price.toLocaleString("id-ID")}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Stock: {product.quantity}
              </p>

              <button
                onClick={() => addtoCart(product)}
                disabled={isLoading}
                className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                Add To Cart
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Cart</h2>

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
                      onClick={() =>
                        item.quantity === 1
                          ? deleteCart(item.id)
                          : decreaseCart(item.id)
                      }
                      disabled={isLoading}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      -
                    </button>

                    <span className="min-w-[40px] text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseCart(item.productId)}
                      disabled={isLoading}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={isLoading || cart.length === 0}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={checkout}
          >
            {isLoading
              ? "Processing cart..."
              : cart.length === 0
              ? "Cart is empty"
              : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}