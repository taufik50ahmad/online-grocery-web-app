import express from "express";
import addtocartController from "../controller/addtocartController.js";
import {
  requireAuth,
  requireVerified,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add/cart", addtocartController)

export default router;