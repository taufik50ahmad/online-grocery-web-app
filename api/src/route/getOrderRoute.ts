import { Router } from "express";
import getOrderController from "../controller/getOrderController.js";
import { requireAuth,requireVerified } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/orders/:id",
  requireAuth,
  requireVerified,
  getOrderController
);

export default router;