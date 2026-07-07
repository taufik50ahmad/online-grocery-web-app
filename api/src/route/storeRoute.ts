import { Router } from "express";
import {
  assignAdminToStore,
  createStoreData,
  deleteStoreData,
  getStoreList,
  registerMyStoreData,
  updateStoreData,
} from "../controller/storeController.js";
import { 
  requireAuth, 
  requireRole, 
  requireVerified } 
  from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireVerified);

//super and store can acce
router.get("/", getStoreList);

//customer create stor
router.post(
  "/register-my-store", 
  requireRole(["CUSTOMER", "STORE_ADMIN"]),
  registerMyStoreData
);

// //only super admin can create store
router.post(
  "/", 
  requireRole(["SUPER_ADMIN"]),
  createStoreData
);

//super_admin and store admin can update store
router.put("/:id", 
  requireRole(["SUPER_ADMIN", "STORE_ADMIN"]),
  updateStoreData
);

//super admin can delete store
router.delete("/:id", 
  requireRole(["SUPER_ADMIN",]),
  deleteStoreData
);

//super admin and store admin can assign store
router.post("/:id/assign-admin", 
  requireRole(["SUPER_ADMIN", "STORE_ADMIN"]),
  assignAdminToStore
);

export default router;