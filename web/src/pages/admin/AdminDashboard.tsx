import { useEffect, useState } from "react";
import { Users, ShieldCheck, UserCheck, TrendingUp } from "lucide-react";
import { getAllUsers } from "@/services/userService";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        toast.error("Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const totalStoreAdmins = users.filter((u) => u.role === "STORE_ADMIN").length;
  const totalSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Pengguna",
      value: totalUsers,
      icon: <Users size={20} className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "Customer",
      value: totalCustomers,
      icon: <UserCheck size={20} className="text-green-600" />,
      color: "bg-green-50",
    },
    {
      label: "Store Admin",
      value: totalStoreAdmins,
      icon: <TrendingUp size={20} className="text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      label: "Super Admin",
      value: totalSuperAdmins,
      icon: <ShieldCheck size={20} className="text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan data pengguna aplikasi
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 h-24 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Pengguna Terbaru</h2>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Nama</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "SUPER_ADMIN"
                            ? "bg-purple-50 text-purple-600"
                            : user.role === "STORE_ADMIN"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-green-50 text-green-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
