import express from "express";
import checkoutController from "../controller/checkoutController.js";
import {
  requireAuth,
  requireVerified,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", requireAuth, requireVerified, checkoutController);

export default router;