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
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/store-admins", label: "Store Admins", icon: Users, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, end: false },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes, end: false },
  { to: "/admin/discounts", label: "Discounts", icon: Percent, end: false },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();

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
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
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
    </div>
  );
}
