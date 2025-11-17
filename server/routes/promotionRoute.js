import express from "express";
import {
  createPromotion,
  getPromotions,
  deletePromotion,
} from "../controllers/promotionController.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/promotion", getPromotions);
router.post("/promotion", authenticateToken, createPromotion);
router.delete("/promotion", authenticateToken, deletePromotion);

export default router;
