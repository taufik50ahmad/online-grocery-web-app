import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { getProductById } from "../../services/productService";
import type { Product } from "../../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await getProductById(Number(id));
        setProduct(res.data);
      } catch {
        setError("Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400">{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
          {product.images?.[0]?.imageUrl ? (
            <img
              src={product.images[0].imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{product.unit}</p>
          </div>

          <p className="text-2xl font-semibold text-gray-800">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          {product.description && (
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-1">Description</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.stock > 0
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
            {product.category && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                {product.category.name}
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <ShoppingCart size={16} />
                Add to Cart - Rp {(product.price * quantity).toLocaleString("id-ID")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}