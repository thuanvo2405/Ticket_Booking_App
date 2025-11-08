import express from "express";
import {
  signup,
  login,
  getRefreshToken,
  deleteRefreshToken,
  resendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authorization.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh_token", getRefreshToken);
router.delete("/refresh_token", deleteRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.post("/resend-verification", resendVerificationEmail);
router.get("/verify-email", verifyEmail);

router.get("/test", checkRole(["KHACH_HANG"]), (req, res) => {
  res.send("hello 123");
});

router.get("/auth/me", authenticateToken, getCurrentUser);

export default router;
