import express from "express";
import placeOrderController from "../controller/placeOrderController.js";
import { requireAuth, requireVerified } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post(
  "/:orderId/place",
  requireAuth,
  requireVerified,
  placeOrderController
);


export default router;