import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import ProductSearch from "../../components/product/ProductSearch";
import { getProducts } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import type { Product, Category } from "../../types";

export default function ProductCatalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProducts(page, 12, search, selectedCategory);
      setProducts(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getAllCategories(1, 100);
      setCategories(res.data ?? []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>
        <p className="text-sm text-gray-400">Browse our fresh grocery selection</p>
      </div>

      <ProductSearch
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(id) => {
          setSelectedCategory(id);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}