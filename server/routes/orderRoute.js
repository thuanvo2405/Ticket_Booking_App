import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/authorization.js";
const router = express.Router();

router.post("/order", authenticateToken, createOrder);

export default router;
