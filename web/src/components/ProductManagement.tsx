import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type ProductManagementProps = {
  canManageProduct: boolean;
};

export function ProductManagement({ canManageProduct }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  async function loadProducts() {
    try {
      const result = await getProducts();
      setProducts(result.products || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal mengambil produk");
        return;
      }

      alert("Gagal mengambil produk");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setEditingProductId(null);
    setName("");
    setPrice("");
    setStock("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = {
        name,
        price: Number(price),
        stock: Number(stock),
      };

      if (editingProductId) {
        const result = await updateProduct(editingProductId, payload);
        alert(result.message || "Product berhasil diperbarui");
      } else {
        const result = await createProduct(payload);
        alert(result.message || "Product berhasil dibuat");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyimpan produk");
        return;
      }

      alert("Gagal menyimpan produk");
    }
  }

  function handleEdit(product: Product) {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setStock(String(product.stock));
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus produk ini?");

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteProduct(id);
      alert(result.message || "Product berhasil dihapus");
      await loadProducts();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menghapus produk");
        return;
      }

      alert("Gagal menghapus produk");
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">Store Products</h2>

      {canManageProduct && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-3">
          <input
            type="text"
            placeholder="Product name"
            className="rounded border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="rounded border px-3 py-2"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            className="rounded border px-3 py-2"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              {editingProductId ? "Update Product" : "Add Product"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded bg-slate-500 px-4 py-2 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada produk.</p>
        )}

        {products.map((product) => (
          <div key={product.id} className="rounded-xl border p-4">
            <h3 className="font-semibold">{product.name}</h3>

            <p className="mt-1 text-sm text-slate-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <p className="text-sm text-slate-500">Stock: {product.stock}</p>

            {canManageProduct && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}