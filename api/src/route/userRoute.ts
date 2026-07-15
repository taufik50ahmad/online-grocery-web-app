import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getStoreAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
} from "../controller/userController.js";

const router = Router();

router.use(requireAuth, requireRole(["SUPER_ADMIN"]));

router.get("/", getAllUsers);
router.get("/store-admins", getStoreAdmins);
router.post("/store-admins", createStoreAdmin);
router.put("/store-admins/:id", updateStoreAdmin);
router.delete("/store-admins/:id", deleteStoreAdmin);

export default router;
