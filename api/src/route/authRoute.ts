import { Router } from "express";
import {
  confirmResetPassword,
  forgotPassword,
  login,
  me,
  register,
  resendVerification,
  updateProfile,
  verifyEmail,
<<<<<<< Updated upstream
=======
  resendVerificationEmail,
  googleLogin,
  changePassword,
>>>>>>> Stashed changes
} from "../controller/authController.js";

const router = Router();

router.get("/me", me);

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", confirmResetPassword);

router.put("/profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

export default router;
