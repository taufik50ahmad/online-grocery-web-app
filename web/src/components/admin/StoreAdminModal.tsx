import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { StoreAdmin } from "../../types/user";

interface Props {
  isOpen: boolean;
  mode?: "create" | "edit";
  editData: StoreAdmin | null;
  onSubmit: (data: { name: string; email: string; password?: string }) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function StoreAdminModal({
  isOpen,
  mode,
  editData,
  onSubmit,
  onClose,
  isLoading,
}: Props) {
  const resolvedMode = mode ?? (editData ? "edit" : "create");
  const [name, setName] = useState(editData?.name ?? "");
  const [email, setEmail] = useState(editData?.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form state when modal opens or editData changes
  useEffect(() => {
    if (isOpen) {
      setName(editData?.name ?? "");
      setEmail(editData?.email ?? "");
      setPassword("");
      setErrors({});
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name || name.length < 2) errs.name = "Nama minimal 2 karakter";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email tidak valid";
    if (resolvedMode === "create" && (!password || password.length < 6))
      errs.password = "Password minimal 6 karakter";
    if (resolvedMode === "edit" && password && password.length < 6)
      errs.password = "Password minimal 6 karakter";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data: { name: string; email: string; password?: string } = {
      name,
      email,
    };
    if (password) data.password = password;
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">
            {resolvedMode === "create" ? "Tambah Store Admin" : "Edit Store Admin"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={resolvedMode === "edit"}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="admin@toko.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password{" "}
              {resolvedMode === "edit" && (
                <span className="text-gray-400 font-normal">
                  (kosongkan jika tidak diubah)
                </span>
              )}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}