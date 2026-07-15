import { AlertTriangle, X } from "lucide-react";

interface Props {
  isOpen?: boolean;
  title?: string;
  name: string;
  adminName?: string;
  onConfirm: () => void;
  onClose: () => void;
  submitting?: boolean;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen = true,
  title = "Hapus Data",
  name,
  adminName,
  onConfirm,
  onClose,
  submitting,
  isLoading,
}: Props) {
  if (!isOpen) return null;

  const displayName = adminName ?? name;
  const isProcessing = submitting ?? isLoading ?? false;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
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

        <p className="text-sm text-gray-600 mb-6">
          Apakah kamu yakin ingin menghapus{" "}
          <span className="font-semibold text-gray-800">{displayName}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isProcessing ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}