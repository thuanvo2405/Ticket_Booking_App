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
  resetPasswordByUserId,
  loginForAdmin,
  signupForAdmin,
} from "../controllers/authController.js";
import {
  getProfileUser,
  updateProfileUser,
  deleteForAdmin,
  getUsers,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authorization.js";
import checkRole from "../middleware/verifyRole.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh_token", getRefreshToken);
router.delete("/refresh_token", deleteRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/password", authenticateToken, resetPasswordByUserId);

router.post("/resend-verification", resendVerificationEmail);
router.get("/verify-email", verifyEmail);

router.get("/test", checkRole(["KHACH_HANG"]), (req, res) => {
  res.send("hello 123");
});

router.get("/profile", authenticateToken, getProfileUser);
router.patch(
  "/profile",
  authenticateToken,
  upload.single("anhdaidien"),
  updateProfileUser
);

//ADMIN
router.post("/admin-login", loginForAdmin);
router.post(
  "/signup-admin",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  signupForAdmin
);

router.delete(
  "/admin-delete/:manguoidung",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  deleteForAdmin
);

router.get("/users", authenticateToken, checkRole(["QUAN_TRI"]), getUsers);

export default router;
