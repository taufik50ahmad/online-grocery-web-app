import { Router } from "express";
import {
  createProductData,
  deleteProductData,
  getProductList,
  updateProductData,
} from "../controller/productController.js";
import {
  requireAuth,
  requireRole,
  requireVerified,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProductList);

router.post(
  "/",
  requireAuth,
  requireVerified,
  requireRole(["STORE_ADMIN", "SUPER_ADMIN"]),
  createProductData
);

router.put(
  "/:id",
  requireAuth,
  requireVerified,
  requireRole(["STORE_ADMIN", "SUPER_ADMIN"]),
  updateProductData
);

router.delete(
  "/:id",
  requireAuth,
  requireVerified,
  requireRole(["STORE_ADMIN", "SUPER_ADMIN"]),
  deleteProductData
);

export default router;