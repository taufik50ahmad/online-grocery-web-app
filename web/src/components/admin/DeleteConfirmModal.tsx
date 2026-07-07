import { AlertTriangle, X } from "lucide-react";

interface Props {
  title?: string;
  name: string;
  onConfirm: () => void;
  onClose: () => void;
  submitting: boolean;
}

export default function DeleteConfirmModal({
  title = "Hapus Data",
  name,
  onConfirm,
  onClose,
  submitting,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            <h2 className="font-bold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-6">
          Apakah kamu yakin ingin menghapus{" "}
          <span className="font-semibold text-gray-800">{name}</span>? Tindakan
          ini tidak dapat dibatalkan.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
