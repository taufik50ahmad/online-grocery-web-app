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
router.get("/admins", getStoreAdmins);
router.post("/admins", createStoreAdmin);
router.put("/admins/:id", updateStoreAdmin);
router.delete("/admins/:id", deleteStoreAdmin);

export default router;
