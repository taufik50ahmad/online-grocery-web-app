import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePages";
import { LoginPage } from "./pages/LoginPage";
import { StoreManagementPage } from "./pages/StoreManagementPage";
import { StoreFrontPage } from "./pages/StoreFrontPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store-management" element={<StoreManagementPage />} />
        <Route path="/store/:storeId" element={<StoreFrontPage />} />
      </Routes>
    </BrowserRouter>
  );
}