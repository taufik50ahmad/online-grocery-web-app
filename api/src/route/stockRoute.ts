// api/src/route/stockRoute.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getStockList,
  getStockDetail,
  createStockAdjustment,
  getJournalList,
} from "../controller/stockController.js";

const router = Router();

const adminRoles = ["SUPER_ADMIN", "STORE_ADMIN"];

router.get("/", requireAuth, requireRole(adminRoles), getStockList);
router.get("/journals", requireAuth, requireRole(adminRoles), getJournalList);
router.post("/adjust", requireAuth, requireRole(adminRoles), createStockAdjustment);
router.get("/:id", requireAuth, requireRole(adminRoles), getStockDetail);

export default router;