import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import type { StoreAdmin } from "@/types/user";
import { userService } from "@/services/userService";
import StoreAdminTable from "@/components/admin/StoreAdminTable";
import StoreAdminModal from "@/components/admin/StoreAdminModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function StoreAdminManagement() {
  const [admins, setAdmins] = useState<StoreAdmin[]>([]);
  const [filtered, setFiltered] = useState<StoreAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<StoreAdmin | null>(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getStoreAdmins();
      setAdmins(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load store admins");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      admins.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.email.toLowerCase().includes(lower),
      ),
    );
  }, [search, admins]);

  const handleOpenCreate = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: StoreAdmin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (admin: StoreAdmin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedAdmin) {
        await userService.updateStoreAdmin(selectedAdmin.id, data);
        toast.success("Store admin updated successfully");
      } else {
        await userService.createStoreAdmin(data);
        toast.success("Store admin created successfully");
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setIsSubmitting(true);
    try {
      await userService.deleteStoreAdmin(selectedAdmin.id);
      toast.success("Store admin deleted successfully");
      setIsDeleteOpen(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete admin");
      setIsDeleteOpen(false);
      setSelectedAdmin(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Store Admin Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all store administrators
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <StoreAdminTable
        admins={filtered}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        loading={isLoading}
      />

      <StoreAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editData={selectedAdmin}
        isLoading={isSubmitting}
      />

      {isDeleteOpen && (
        <DeleteConfirmModal
          name={selectedAdmin?.name ?? ""}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedAdmin(null);
          }}
          onConfirm={handleDelete}
          submitting={isSubmitting}
          title="Hapus Store Admin"
        />
      )}
    </div>
  );
}
