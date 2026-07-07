import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryModal from "../../components/admin/CategoryModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = localStorage.getItem("adminRole");
  const isSuperAdmin = role === "SUPER_ADMIN";

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllCategories(page, 10, search);
      setCategories(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const delay = setTimeout(fetchCategories, 300);
    return () => clearTimeout(delay);
  }, [fetchCategories]);

  const handleSubmit = async (data: { name: string }) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
        toast.success("Category updated successfully");
      } else {
        await createCategory(data);
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(cat) => {
            setSelectedCategory(cat);
            setIsModalOpen(true);
          }}
          onDelete={(cat) => {
            setSelectedCategory(cat);
            setIsDeleteOpen(true);
          }}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 text-sm rounded-md ${
                p === page
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmit}
        editData={selectedCategory}
        isLoading={isSubmitting}
      />

      {isDeleteOpen && selectedCategory && (
        <DeleteConfirmModal
          name={selectedCategory.name}
          onConfirm={handleDelete}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedCategory(null);
          }}
          submitting={isSubmitting}
          title="Delete Category"
        />
      )}
    </div>
  );
}