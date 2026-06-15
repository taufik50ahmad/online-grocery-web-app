import { Plus, Store } from "lucide-react";
import type { Product } from "../types/product";
import { formatRupiah } from "../utils/Currency";

type ProductCardProps = {
  product: Product;
  disabled?: boolean;
};

export function ProductCard({ product, disabled }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article
      className={`rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${disabled ? "opacity-60" : ""}`}
    >
      <div className="relative mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 text-6xl">
        {product.discountLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-black text-white">
            {product.discountLabel}
          </span>
        )}
        <span>{product.image}</span>
      </div>

      <p className="text-xs font-bold text-red-600">{product.category}</p>
      <h3 className="mt-1 min-h-11 text-sm font-black text-slate-900">
        {product.name}
      </h3>

      <div className="mt-3">
        <p className="text-lg font-black text-red-600">
          {formatRupiah(product.price)}
        </p>
        {product.oldPrice && (
          <p className="text-xs font-semibold text-slate-400 line-through">
            {formatRupiah(product.oldPrice)}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-500">
        <Store size={14} /> Stok: {product.stock}
      </div>

      <button
        disabled={disabled || isOutOfStock}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Plus size={16} /> {isOutOfStock ? "Stok Habis" : "Tambah"}
      </button>
    </article>
  );
}
