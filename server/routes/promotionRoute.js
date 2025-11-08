import express from "express";
import { createPromotion } from "../controllers/promotionController.js";

const router = express.Router();

router.post("/promotion", createPromotion);

export default router;
