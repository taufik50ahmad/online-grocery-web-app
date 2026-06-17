import { useState, useEffect } from "react";

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
}

export default function ProductPage() {
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
  
  async function addtoCart(product: Product){
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
    })

    const response = await fetch("http://localhost:9000/get/cart")
    const result = await response.json()

    setCart(result.data)
  }

  useEffect(() => {
    async function fetchCart(){
      const response = await fetch("http://localhost:9000/get/cart")
      const result = await response.json()

      setCart(result.data)
    }

    fetchCart()
  }, [])

  async function deleteCart(productId: number){
    await fetch(`http://localhost:9000/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: productId
      }),
    })

    const response = await fetch("http://localhost:9000/get/cart")
    const result = await response.json()

    setCart(result.data)
  }

  async function increaseCart(productId: number){
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
    })

    const response = await fetch("http://localhost:9000/get/cart")
    const result = await response.json()

    setCart(result.data)
  }

  async function decreaseCart(id: number){
    await fetch(`http://localhost:9000/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        productId: id
      }),
    })

    const response = await fetch("http://localhost:9000/get/cart")
    const result = await response.json()

    setCart(result.data)
  }

  return (
    <>
      <h1>Products</h1>

      {dummyProducts.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>

          <button
            onClick={() => addtoCart(product)}
          >
            Add To Cart
          </button>
        </div>
      ))}

      <hr />

      <h1>Cart</h1>

      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.productName}</h3>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => item.quantity === 1 ? deleteCart(item.id) : decreaseCart(item.id)}>
            -
          </button>
          <button onClick={() => increaseCart(item.productId)}>
            +
          </button>
          <p>Total Price: {item.totalPrice}</p>
        </div>
      ))}
    </>
  );
}