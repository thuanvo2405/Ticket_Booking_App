import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/authorization.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get(
  "/event-categories",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getCategories
);
router.post(
  "/event-categories",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  createCategory
);
router.patch(
  "/event-categories/:id",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  updateCategory
);
router.delete(
  "/event-categories/:id",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  deleteCategory
);

export default router;
