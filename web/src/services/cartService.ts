import api from "./api";

export async function addToCart(productId: number, quantity = 1) {
  const response = await api.post("/add/cart", {
    productId,
    quantity,
  });

  return response.data;
}

export async function getCart() {
  const response = await api.get("/get/cart");
  return response.data;
}

export async function decreaseCart(id: number) {
  const response = await api.patch(`/cart/${id}`);
  return response.data;
}

export async function deleteCart(id: number) {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
}