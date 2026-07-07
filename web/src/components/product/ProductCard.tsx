import { ShoppingCart } from "lucide-react";
import type { Product } from "../../types";

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick?.(product)}
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {product.images?.[0]?.imageUrl ? (
          <img
            src={product.images[0].imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400">{product.unit}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800 text-sm">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">In stock</span>
          ) : (
            <span className="text-xs text-red-500">Out of stock</span>
          )}
        </div>
        {onAddToCart && product.stock > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}