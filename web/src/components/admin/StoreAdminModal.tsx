import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X } from "lucide-react";

interface StoreAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Props {
  mode: "create" | "edit";
  initialData: StoreAdmin | null;
  onSubmit: (data: { name: string; email: string; password?: string }) => void;
  onClose: () => void;
  submitting: boolean;
}

const createSchema = yup.object({
  name: yup.string().min(2, "Minimal 2 karakter").required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("Password wajib diisi"),
});

const editSchema = yup.object({
  name: yup.string().min(2, "Minimal 2 karakter").required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .test(
      "optional-min",
      "Minimal 6 karakter",
      (val) => !val || val.length >= 6,
    ),
});

type FormData = { name: string; email: string; password?: string };

export default function StoreAdminModal({
  mode,
  initialData,
  onSubmit,
  onClose,
  submitting,
}: Props) {
  const schema = mode === "create" ? createSchema : editSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      password: "",
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">
            {mode === "create" ? "Tambah Store Admin" : "Edit Store Admin"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@toko.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password{" "}
              {mode === "edit" && (
                <span className="text-gray-400 font-normal">
                  (kosongkan jika tidak diubah)
                </span>
              )}
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
