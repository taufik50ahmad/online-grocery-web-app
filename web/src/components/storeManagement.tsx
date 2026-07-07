import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  assignStoreAdmin,
  createStore,
  deleteStore,
  getStores,
  registerMyStore,
  updateStore,
} from "../services/storeService";

type Store = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  latitude: string | number;
  longitude: string | number;
  storeAdminId?: number | null;
  storeAdmin?: {
    id: number;
    name?: string;
    email: string;
    role: string;
  } | null;
};

type StoreManagementProps = {
  userRole: "USER" | "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN" | "ADMIN";
};

export function StoreManagement({ userRole }: StoreManagementProps) {
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const [stores, setStores] = useState<Store[]>([]);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [assignUserId, setAssignUserId] = useState("");

  async function loadStores() {
    try {
      const result = await getStores();
      setStores(result.stores || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal mengambil data toko");
        return;
      }

      alert("Gagal mengambil data toko");
    }
  }

  useEffect(() => {
    loadStores();
  }, []);

  function resetForm() {
    setEditingStoreId(null);
    setName("");
    setAddress("");
    setCity("");
    setLatitude("");
    setLongitude("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = {
        name,
        address,
        city,
        latitude: Number(latitude),
        longitude: Number(longitude),
      };

      if (editingStoreId) {
        const result = await updateStore(editingStoreId, payload);
        alert(result.message || "Store berhasil diperbarui");
      } else {
        if (isSuperAdmin) {
        await createStore(payload);
      } else {
        await registerMyStore(payload);
      }
    }

    alert("Store berhasil disimpan");

      resetForm();
      await loadStores();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyimpan store");
        return;
      }

      alert("Gagal menyimpan store");
    }
  }

  function handleEdit(store: Store) {
    setEditingStoreId(store.id);
    setName(store.name || "");
    setAddress(store.address || "");
    setCity(store.city || "");
    setLatitude(String(store.latitude || ""));
    setLongitude(String(store.longitude || ""));
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus store ini?");

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteStore(id);
      alert(result.message || "Store berhasil dihapus");
      await loadStores();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menghapus store");
        return;
      }

      alert("Gagal menghapus store");
    }
  }

  async function handleAssignStoreAdmin(storeId: number) {
    try {
      const userId = Number(assignUserId);

      if (!userId) {
        alert("Masukkan user ID store admin");
        return;
      }

      const result = await assignStoreAdmin(storeId, userId);
      alert(result.message || "Store admin berhasil di-assign");

      setAssignUserId("");
      await loadStores();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal assign store admin");
        return;
      }

      alert("Gagal assign store admin");
    }
  }

  return (
    <section className="mx-auto my-6 max-w-4xl rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Store Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3">
        <input
          type="text"
          placeholder="Store name"
          className="rounded border px-3 py-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="rounded border px-3 py-2"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="rounded border px-3 py-2"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <input
          type="number"
          step="any"
          placeholder="Latitude"
          className="rounded border px-3 py-2"
          value={latitude}
          onChange={(event) => setLatitude(event.target.value)}
        />

        <input
          type="number"
          step="any"
          placeholder="Longitude"
          className="rounded border px-3 py-2"
          value={longitude}
          onChange={(event) => setLongitude(event.target.value)}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            {editingStoreId ? "Update Store" : "Create Store"}
          </button>

          {editingStoreId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded bg-slate-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {stores.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada store.</p>
        )}

        {stores.map((store) => (
          <div key={store.id} className="rounded border p-4">
            <h3 className="font-semibold">{store.name}</h3>

            <p className="text-sm text-slate-600">
              {store.address || "-"} | {store.city || "-"}
            </p>

            <p className="text-sm text-slate-600">
              Lat: {String(store.latitude)} | Long: {String(store.longitude)}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Store Admin:{" "}
              {store.storeAdmin
                ? `${store.storeAdmin.name || store.storeAdmin.email}`
                : "Belum di-assign"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
  <Link
    to={`/store/${store.id}`}
    className="rounded bg-red-600 px-3 py-1 text-sm text-white"
  >
    Open Storefront
  </Link>

  <button
    type="button"
    onClick={() => handleEdit(store)}
    className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
  >
    Edit
  </button>

  {isSuperAdmin && (
    <button
      type="button"
      onClick={() => handleDelete(store.id)}
      className="rounded bg-red-600 px-3 py-1 text-sm text-white"
    >
      Delete
    </button>
              )}

              {isSuperAdmin && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    placeholder="Store admin user ID"
                    className="flex-1 rounded border px-3 py-2"
                    value={assignUserId}
                    onChange={(event) => setAssignUserId(event.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => handleAssignStoreAdmin(store.id)}
                    className="rounded bg-purple-600 px-3 py-2 text-sm text-white"
                  >
                    Assign Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}