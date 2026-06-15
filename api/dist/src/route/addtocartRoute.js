import express from "express";
import addtocartController from "../controller/addtocartController.js";
const router = express.Router();
router.post("/add/cart", addtocartController);
export default router;
//# sourceMappingURL=addtocartRoute.js.map