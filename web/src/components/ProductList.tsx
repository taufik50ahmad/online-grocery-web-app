import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import type { Store } from "../types/store";
import { ProductCard } from "./ProductCard";
import { addToCart } from "../services/cartService";

type ProductListProps = {
  products: Product[];
  selectedStore?: Store;
  disabled?: boolean;
};

export function ProductList({
  products,
  selectedStore,
  disabled,
}: ProductListProps) {
  const navigate = useNavigate();

  async function handleAddToCart(productId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Silakan login terlebih dahulu untuk menambahkan produk ke cart.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(productId, 1);
      alert("Produk berhasil ditambahkan ke cart");
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      alert("Gagal menambahkan produk ke cart");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 lg:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-red-600">
            Produk Toko Terdekat
          </p>
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
            Tersedia di {selectedStore?.name || "toko utama"}
          </h2>
        </div>

        <button className="hidden rounded-2xl bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm md:block">
          Lihat Semua
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-black text-slate-900">
            Produk tidak ditemukan
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Coba gunakan kata kunci lain.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              disabled={disabled}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}