import express from "express";
import { createOrder, getOrderById } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/authorization.js";
const router = express.Router();

router.post("/order", authenticateToken, createOrder);
router.get("/order/:madonhang", authenticateToken, getOrderById);

export default router;
