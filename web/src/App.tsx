import { Routes, Route } from "react-router-dom";
import HomePages from "@/pages/HomePages";
import { LoginPage as CustomerLoginPage } from "@/pages/LoginPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StoreAdminManagement from "@/pages/admin/StoreAdminManagement";
import LoginPage from "@/pages/admin/LoginPage";
import CategoryManagement from "@/pages/admin/CategoryManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import ProductCatalog from "@/pages/products/ProductCatalog";
import ProductDetail from "@/pages/products/ProductDetail";
import InventoryManagement from "@/pages/admin/InventoryManagement";
import DiscountManagement from "@/pages/admin/DiscountManagement";
import ReportAnalysis from "@/pages/admin/ReportAnalysis";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/confirm-reset-password" element={<ResetPasswordPage />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="store-admins" element={<StoreAdminManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="reports" element={<ReportAnalysis />} />
        </Route>
      </Routes>
    </>
  );
}