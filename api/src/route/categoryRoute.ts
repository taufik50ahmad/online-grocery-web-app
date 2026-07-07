// api/src/route/categoryRoute.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getCategoryList,
  getCategoryDetail,
  createCategoryData,
  updateCategoryData,
  deleteCategoryData,
} from "../controller/categoryController.js";

const router = Router();

// Public - anyone can view categories
router.get("/", getCategoryList);
router.get("/:id", getCategoryDetail);

// Protected - Super Admin only
router.post("/", requireAuth, requireRole(["SUPER_ADMIN"]), createCategoryData);
router.put("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), updateCategoryData);
router.delete("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), deleteCategoryData);

export default router;
