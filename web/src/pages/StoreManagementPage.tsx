import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getProfile } from "../services/authService";
import { StoreManagement } from "../components/storeManagement";

type User = {
  id: number;
  email: string;
  name?: string;
  role: "USER" | "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN" | "ADMIN";
  isVerified: boolean;
};

export function StoreManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await getProfile();
        setUser(result.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <p className="text-center text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "STORE_ADMIN" && user.role !== "SUPER_ADMIN") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow">
          <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            Only Store Admin and Super Admin can access this page.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto mb-4 max-w-4xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-red-600">
            Store Management
          </h1>
          <p className="text-sm text-slate-500">
            Logged in as {user.role}
          </p>
        </div>

        <Link
          to="/"
          className="rounded bg-slate-700 px-4 py-2 text-sm text-white"
        >
          Home
        </Link>
      </div>

      <StoreManagement userRole={user.role} />
    </main>
  );
}