import axios from "axios";

const API_URL = "http://localhost:9000/api/products";

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getProducts() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createProduct(data: {
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}) {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
  }
) {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeader(),
  });

  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

  return response.data;
}