import { Router } from "express";
import {
  assignAdminToStore,
  createStoreData,
  deleteStoreData,
  getStoreList,
  updateStoreData,
} from "../controller/storeController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["SUPER_ADMIN"]));

router.get("/", getStoreList);
router.post("/", createStoreData);
router.put("/:id", updateStoreData);
router.delete("/:id", deleteStoreData);

router.post("/:id/assign-admin", assignAdminToStore);

export default router;