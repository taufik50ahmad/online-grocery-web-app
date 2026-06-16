import { Router } from "express";
import {
  confirmResetPassword,
  forgotPassword,
  login,
  me,
  register,
  registerAsStoreAdmin,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
} from "../controller/authController.js";
import { requireAuth, requireVerified } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", me);

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", confirmResetPassword);
router.post("/resend-verification", resendVerificationEmail);
router.post("/register-store-admin",
  requireAuth,
  requireVerified,
  registerAsStoreAdmin,
);

router.put("/profile", updateProfile);

export default router;