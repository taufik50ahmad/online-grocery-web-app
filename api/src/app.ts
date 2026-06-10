import express from "express";
import "dotenv/config"
import cors from "cors";
import authRoutes from "./route/authRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173"]
}))

app.use(express.json());
app.get("/", (_req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});