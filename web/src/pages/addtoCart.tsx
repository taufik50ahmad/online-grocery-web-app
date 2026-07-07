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
  const [isLoading, setIsLoading] = useState(false)
  
  async function addtoCart(product: Product){
    setIsLoading(true)
    await fetch("http://localhost:9000/add/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: product.id,
        quantity: 1,
      }),
    });

    const response = await fetch("http://localhost:9000/get/cart");
    const result = await response.json();

    setCart(result.data)
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchCart() {
      const response = await fetch("http://localhost:9000/get/cart");
      const result = await response.json();

      setCart(result.data);
    }

    fetchCart();
  }, []);

  async function deleteCart(productId: number){
    setIsLoading(true)
    await fetch(`http://localhost:9000/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: productId,
      }),
    });

    const response = await fetch("http://localhost:9000/get/cart");
    const result = await response.json();

    setCart(result.data)
    setIsLoading(false)
  }

  async function increaseCart(productId: number){
    setIsLoading(true)
    await fetch("http://localhost:9000/add/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: productId,
        quantity: 1,
      }),
    });

    const response = await fetch("http://localhost:9000/get/cart");
    const result = await response.json();

    setCart(result.data)
    setIsLoading(false)
  }

  async function decreaseCart(id: number){
    setIsLoading(true)
    await fetch(`http://localhost:9000/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: id,
      }),
    });

    const response = await fetch("http://localhost:9000/get/cart");
    const result = await response.json();

    setCart(result.data)
    setIsLoading(false)
  }

  async function checkout(){
    setIsLoading(true)
    await fetch("http://localhost:9000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId:1
      }),
    })

    const response = await fetch("http://localhost:9000/get/cart")
    const result = await response.json()

    setCart(result.data)
    setIsLoading(false)
  }

  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-slate-100 p-8">
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-4xl font-bold text-slate-800">
        Grocery Store
      </h1>

      {/* Products */}
      <h2 className="mb-4 text-2xl font-semibold">Products</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {dummyProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl bg-white p-5 shadow-md"
          >
            <h3 className="text-xl font-semibold">
              {product.name}
            </h3>

            <p className="mt-2 text-lg text-green-600 font-bold">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Stock: {product.quantity}
            </p>

            <button
              onClick={() => addtoCart(product)}
              className="cursor-pointer mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Cart</h2>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow">
            <p className="text-slate-500">
              Your cart is empty
            </p>
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
                    className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    -
                  </button>

                  <span className="min-w-[40px] text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseCart(item.productId)
                    }
                    className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CHECKOUT SECTION (FIXED POSITION) */}
      <div className="mt-6 flex justify-end">
        <button
          disabled={isLoading || cart.length === 0}
          className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          onClick={async () => {
             await checkout();
             navigate("/checkout");
          }}
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
