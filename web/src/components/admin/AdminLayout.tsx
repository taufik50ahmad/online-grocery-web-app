import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ShieldCheck,
  Tag,
  Package,
  Boxes,
  Percent,
  BarChart3,
  KeyRound,
  UserPlus,
} from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/store-admins", label: "Store Admins", icon: Users, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, end: false },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes, end: false },
  { to: "/admin/discounts", label: "Discounts", icon: Percent, end: false },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, end: false },
];

function getAdminInfo(): { role: string; name?: string; email?: string } {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { role: "" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role || "",
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return { role: "" };
  }
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const adminInfo = getAdminInfo();
  const isSuperAdmin = adminInfo.role === "SUPER_ADMIN";

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <ShieldCheck size={22} className="text-blue-600" />
          <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* Quick Action: Add Admin (Super Admin only) */}
          {isSuperAdmin && (
            <button
              onClick={() => navigate("/admin/store-admins")}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
            >
              <UserPlus size={18} />
              Add Admin
            </button>
          )}
        </nav>

        {/* User Info & Actions */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          {/* User Info */}
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-gray-400">Login sebagai</p>
            <p className="text-sm font-medium text-gray-700 truncate">
              {adminInfo.name || adminInfo.email || "Admin"}
            </p>
            <p className="text-xs text-gray-400">{adminInfo.role}</p>
          </div>

          {/* Change Password */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <KeyRound size={18} />
            Ubah Password
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
