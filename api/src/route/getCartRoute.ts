import express from "express";
import getCartController from "../controller/getCartController.js";
import {
  requireAuth,
  requireVerified,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get/cart", requireAuth, requireVerified, getCartController);

export default router;