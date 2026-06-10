import { Router } from "express";
import {
  confirmResetPassword,
  forgotPassword,
  login,
  me,
  register,
  updateProfile,
  verifyEmail,
} from "../controller/authController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/me", me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", confirmResetPassword);
router.put("/profile", updateProfile);

export default router;