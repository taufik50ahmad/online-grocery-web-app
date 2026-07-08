// api/src/route/productRoute.ts
import { Router } from "express";
import {
  requireAuth,
  requireRole,
  requireVerified,
} from "../middleware/authMiddleware.js";
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


// Protected - Super Admin & Store Admin
const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];
router.post("/", requireAuth, requireRole(adminRoles), createProductData);
router.put("/:id", requireAuth, requireRole(adminRoles), updateProductData);
router.delete("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), deleteProductData);
router.patch("/:id/toggle", requireAuth, requireRole(adminRoles), toggleProductStatusData);

export default router;
