import express from "express";
import {
  signup,
  login,
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
  toggleUserStatus,
  getUsers,
  updateForAdmin,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authorization.js";
import checkRole from "../middleware/verifyRole.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
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

router.patch(
  "/user-admin/:manguoidung",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  updateForAdmin
);

router.patch(
  "/toggle-status/:manguoidung",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  toggleUserStatus
);

router.get("/users", authenticateToken, checkRole(["QUAN_TRI"]), getUsers);

export default router;
