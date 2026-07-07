// api/src/route/productRoute.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getProductList,
  getProductDetail,
  createProductData,
  updateProductData,
  deleteProductData,
  toggleProductStatusData,
} from "../controller/productController.js";

const router = Router();

// Public
router.get("/", getProductList);
router.get("/:id", getProductDetail);

// Protected - Super Admin & Store Admin
const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];
router.post("/", requireAuth, requireRole(adminRoles), createProductData);
router.put("/:id", requireAuth, requireRole(adminRoles), updateProductData);
router.delete("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), deleteProductData);
router.patch("/:id/toggle", requireAuth, requireRole(adminRoles), toggleProductStatusData);

export default router;
