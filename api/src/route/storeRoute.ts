import { Router } from "express";
import {
  assignAdminToStore,
  createStoreData,
  deleteStoreData,
  getStoreList,
  registerMyStoreData,
  updateStoreData,
} from "../controller/storeController.js";
import { requireAuth, requireRole, requireVerified } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["SUPER_ADMIN"]));
router.use(requireVerified);

router.get("/", getStoreList);

router.post("/", createStoreData);
//customer create store
router.post("/register-my-store", 
  requireAuth,
  requireVerified,
  registerMyStoreData
);


router.put("/:id", updateStoreData);

router.delete("/:id", deleteStoreData);

router.post("/:id/assign-admin", assignAdminToStore);
router.post("/register", registerMyStoreData);

export default router;