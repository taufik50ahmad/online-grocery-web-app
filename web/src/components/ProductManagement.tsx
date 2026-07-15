import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
};

type ProductManagementProps = {
  canManageProduct: boolean;
};

export function ProductManagement({
  canManageProduct,
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
    setImageUrl("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = {
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
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
    setImageUrl(product.imageUrl || "");
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingProductId ? "Edit Product" : "Add Product"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3">
              <Input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />

              <Input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
              />

              <Input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />

              <div className="flex gap-3">
                <Button type="submit">
                  {editingProductId ? "Update Product" : "Add Product"}
                </Button>

                {editingProductId && (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada produk.</p>
        )}

        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-40 bg-slate-100">
              <img
                src={product.imageUrl || "/products/default-product.jpg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle className="text-base">{product.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm font-semibold text-red-600">
                Rp {product.price.toLocaleString("id-ID")}
              </p>

              <p className="text-sm text-slate-500">Stock: {product.stock}</p>
            </CardContent>

            {canManageProduct && (
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
