import express from "express";
import {
  createPromotion,
  getPromotions,
  deletePromotion,
  updatePromotion,
} from "../controllers/promotionController.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/promotion", getPromotions);
router.post("/promotion", authenticateToken, createPromotion);
router.patch("/promotion/:maKhuyenMai", authenticateToken, updatePromotion);
router.delete("/promotion", authenticateToken, deletePromotion);

export default router;
