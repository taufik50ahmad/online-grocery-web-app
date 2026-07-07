import express from "express";
import "dotenv/config"
import cors from "cors";
import productRoute from "./route/addtocartRoute.js"
import cartRoute from "./route/getCartRoute.js"
import deleteDecreaseCartRoute from "./route/deleteCartRoute.js"
import decreaseCartRoute from "./route/decreaseCartRoute.js"
import authRoutes from "./route/authRoute.js";
import checkoutRoute from "./route/checkoutRoute.js";
import getCheckoutRoute from "./route/getCheckoutRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173"]
}))

app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use(productRoute)

app.use(cartRoute)

app.use(deleteDecreaseCartRoute)

app.use(decreaseCartRoute)

app.use(checkoutRoute)

app.use(getCheckoutRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});