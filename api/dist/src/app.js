import express from "express";
import "dotenv/config";
import cors from "cors";
import productRoute from "./route/addtocartRoute.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: ["http://localhost:5173"]
}));
app.use(cors());
app.use(express.json());
app.use(productRoute);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map