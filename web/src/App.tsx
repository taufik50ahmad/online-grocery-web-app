import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import CartPage from "./pages/addtoCart";
import CheckoutPage from "./pages/checkoutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}