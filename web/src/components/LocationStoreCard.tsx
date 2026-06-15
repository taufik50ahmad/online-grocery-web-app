import { LocateFixed, MapPin, RefreshCcw, Store as StoreIcon, TriangleAlert } from "lucide-react";
import type { Store } from "../types/store";

type LocationStoreCardProps = {
  selectedStore?: Store;
  distanceKm?: number;
  isOutOfRange: boolean;
  locationStatus: "idle" | "loading" | "granted" | "denied" | "error";
  onDetectLocation: () => void;
};

export function LocationStoreCard({ selectedStore, distanceKm, isOutOfRange, locationStatus, onDetectLocation }: LocationStoreCardProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
      <div className="rounded-[1.75rem] border border-red-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600">
              <StoreIcon size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Toko yang melayani kamu</p>
              <h2 className="text-lg font-black text-slate-900">{selectedStore?.name || "Toko utama"}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                <MapPin size={14} /> {selectedStore?.address || "Lokasi default digunakan"}
              </p>
              {typeof distanceKm === "number" && (
                <p className="mt-1 text-xs font-bold text-red-600">Jarak ± {distanceKm.toFixed(1)} km</p>
              )}
            </div>
          </div>

          <button
            onClick={onDetectLocation}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
          >
            {locationStatus === "loading" ? <RefreshCcw size={17} className="animate-spin" /> : <LocateFixed size={17} />}
            Gunakan Lokasi Saya
          </button>
        </div>

        {locationStatus === "denied" && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            Akses lokasi ditolak. Data toko utama akan digunakan otomatis.
          </div>
        )}

        {isOutOfRange && (
          <div className="mt-4 flex gap-2 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            <TriangleAlert className="shrink-0" size={18} />
            Lokasi kamu berada di luar jangkauan toko terdekat. Silakan gunakan alamat lain.
          </div>
        )}
      </div>
    </section>
  );
}
