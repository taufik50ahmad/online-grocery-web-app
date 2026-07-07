// api/src/route/discountRoute.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getDiscountList,
  getDiscountDetail,
  createDiscountData,
  updateDiscountData,
  deleteDiscountData,
  toggleDiscountStatusData,
} from "../controller/discountController.js";

const router = Router();

const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];

router.get("/", requireAuth, requireRole(adminRoles), getDiscountList);
router.get("/:id", requireAuth, requireRole(adminRoles), getDiscountDetail);
router.post("/", requireAuth, requireRole(adminRoles), createDiscountData);
router.put("/:id", requireAuth, requireRole(adminRoles), updateDiscountData);
router.delete("/:id", requireAuth, requireRole(adminRoles), deleteDiscountData);
router.patch("/:id/toggle", requireAuth, requireRole(adminRoles), toggleDiscountStatusData);

export default router;