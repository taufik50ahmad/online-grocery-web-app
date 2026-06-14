import express from "express";
import "dotenv/config"
import cors from "cors";
import productRoute from "./route/addtocartRoute.js"
import cartRoute from "./route/getCartRoute.js"
import deleteDecreaseCartRoute from "./route/deleteDecreaseCartRoute.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173"]
}))

app.use(cors());
app.use(express.json());

app.use(productRoute)

app.use(cartRoute)

app.use(deleteDecreaseCartRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})