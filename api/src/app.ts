// api/src/app.ts
import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./route/authRoute.js";
import userRoutes from "./route/userRoute.js";
import categoryRoutes from "./route/categoryRoute.js";
<<<<<<< Updated upstream
import adminProductRoutes from "./route/productRoute.js";
import stockRoutes from "./route/stockRoute.js";
import discountRoutes from "./route/discountRoute.js";
import reportRoutes from "./route/reportRoute.js";
=======
import productRoutes from "./route/productRoute.js";
import stockRoutes from "./route/stockRoute.js";
import discountRoutes from "./route/discountRoute.js";
import reportRoutes from "./route/reportRoute.js";
import addtocartRoute from "./route/addtocartRoute.js";
import getCartRoute from "./route/getCartRoute.js";
import decreaseCartRoute from "./route/decreaseCartRoute.js";
import deleteCartRoute from "./route/deleteCartRoute.js";
import checkoutRoute from "./route/checkoutRoute.js";
import getCheckoutRoute from "./route/getCheckoutRoute.js";
>>>>>>> Stashed changes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

// Feature 1 & 2 routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
<<<<<<< Updated upstream
app.use("/api/products", adminProductRoutes);
=======
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
>>>>>>> Stashed changes
app.use("/api/stocks", stockRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/reports", reportRoutes);

<<<<<<< Updated upstream
// Legacy cart routes
app.use(productRoute);
app.use(cartRoute);
app.use(deleteDecreaseCartRoute);
app.use(decreaseCartRoute);
=======
// Feature 3 - purchase routes
app.use("/api", addtocartRoute);
app.use("/api", getCartRoute);
app.use("/api", decreaseCartRoute);
app.use("/api", deleteCartRoute);
app.use("/api", checkoutRoute);
app.use("/api", getCheckoutRoute);
>>>>>>> Stashed changes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});