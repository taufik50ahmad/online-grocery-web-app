// api/src/route/reportRoute.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getSalesReport,
  getSalesByCategoryReport,
  getSalesByProductReport,
  getStockSummaryReport,
  getStockDetailReport,
} from "../controller/reportController.js";

const router = Router();

const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];

router.get("/sales", requireAuth, requireRole(adminRoles), getSalesReport);
router.get("/sales/category", requireAuth, requireRole(adminRoles), getSalesByCategoryReport);
router.get("/sales/product", requireAuth, requireRole(adminRoles), getSalesByProductReport);
router.get("/stock/summary", requireAuth, requireRole(adminRoles), getStockSummaryReport);
router.get("/stock/detail", requireAuth, requireRole(adminRoles), getStockDetailReport);

export default router;