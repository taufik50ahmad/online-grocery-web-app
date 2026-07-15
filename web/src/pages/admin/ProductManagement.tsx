// web/src/pages/admin/ProductManagement.tsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import ProductTable from "../../components/admin/ProductTable";
import ProductModal from "../../components/admin/ProductModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductPayload,
} from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import type { Product, Category } from "../../types";

function getAdminRole(): string {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "";
  } catch {
    return "";
  }
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const role = getAdminRole();
  const isSuperAdmin = role === "SUPER_ADMIN";

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getProducts(page, 10, search);
      setProducts(res.products ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: ProductPayload, id?: number) => {
    try {
      if (id) {
        await updateProduct(id, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save product";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete product";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Product Management
          </h1>
          <p className="text-sm text-gray-400">Manage your product catalog</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        isLoading={isLoading}
        isSuperAdmin={isSuperAdmin}
      />

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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        categories={categories}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          submitting={isDeleting}
          title="Delete Product"
        />
      )}
    </div>
  );
}