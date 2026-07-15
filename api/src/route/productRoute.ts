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

const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];

// Public - anyone can view products
router.get("/", getProductList);
router.get("/:id", getProductDetail);

<<<<<<< Updated upstream
// Protected - Super Admin & Store Admin
const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];
router.post("/", requireAuth, requireRole(adminRoles), createProductData);
router.put("/:id", requireAuth, requireRole(adminRoles), updateProductData);
router.delete("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), deleteProductData);
router.patch("/:id/toggle", requireAuth, requireRole(adminRoles), toggleProductStatusData);

export default router;
=======
// Protected - Super Admin & Store Admin (Store Admin = read only via controller logic)
router.post(
  "/",
  requireAuth,
  requireVerified,
  requireRole(adminRoles),
  createProductData,
);

router.put(
  "/:id",
  requireAuth,
  requireVerified,
  requireRole(adminRoles),
  updateProductData,
);

router.delete(
  "/:id",
  requireAuth,
  requireVerified,
  requireRole(["SUPER_ADMIN"]),
  deleteProductData,
);

router.patch(
  "/:id/toggle",
  requireAuth,
  requireVerified,
  requireRole(adminRoles),
  toggleProductStatusData,
);

export default router;
>>>>>>> Stashed changes
