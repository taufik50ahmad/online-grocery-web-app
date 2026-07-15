import { Pencil, Trash2 } from "lucide-react";
import type { StoreAdmin } from "../../types/user";

interface Props {
  admins: StoreAdmin[];
  loading: boolean;
  onEdit: (admin: StoreAdmin) => void;
  onDelete: (admin: StoreAdmin) => void;
}

export default function StoreAdminTable({
  admins,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">
          Belum ada store admin terdaftar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Nama</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Bergabung</th>
              <th className="px-5 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">
                  {admin.name}
                </td>
                <td className="px-5 py-3 text-gray-500">{admin.email}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(admin)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(admin)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
