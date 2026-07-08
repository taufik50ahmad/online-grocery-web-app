// api/src/app.ts
import express from "express";
import "dotenv/config";
import cors from "cors";
import productRoute from "./route/addtocartRoute.js";
import cartRoute from "./route/getCartRoute.js";
import deleteDecreaseCartRoute from "./route/deleteCartRoute.js";
import decreaseCartRoute from "./route/decreaseCartRoute.js";
import authRoutes from "./route/authRoute.js";
import checkoutRoute from "./route/checkoutRoute.js";
import getCheckoutRoute from "./route/getCheckoutRoute.js";
import userRoutes from "./route/userRoute.js";
import storeRoutes from "./route/storeRoute.js";
import categoryRoutes from "./route/categoryRoute.js";
import adminProductRoutes from "./route/productRoute.js";
import ProductRoutes from "./route/productRoute.js";
import stockRoutes from "./route/stockRoute.js";
import discountRoutes from "./route/discountRoute.js";
import reportRoutes from "./route/reportRoute.js";
import addtocartRoute from "./route/addtocartRoute.js";
import getCartRoute from "./route/getCartRoute.js";
import deleteCartRoute from "./route/deleteCartRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", adminProductRoutes);
app.use("/api/products", productRoute);
app.use("/api/stocks", stockRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/reports", reportRoutes);

// purchase
app.use("/api", addtocartRoute);
app.use("/api", getCartRoute);
app.use("/api", decreaseCartRoute);
app.use("/api", deleteCartRoute);
app.use("/api", checkoutRoute);
app.use("/api", getCheckoutRoute);

// Legacy cart routes

app.use(productRoute);
app.use(cartRoute);
app.use(deleteDecreaseCartRoute);
app.use(decreaseCartRoute);

app.use(checkoutRoute)

app.use(getCheckoutRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
