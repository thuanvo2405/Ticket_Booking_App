import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrderDetail,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/authorization.js";
const router = express.Router();

router.post("/order", authenticateToken, createOrder);
router.get("/order/:madonhang", authenticateToken, getOrderById);

router.get("/user/orders", authenticateToken, getOrdersByUserId);
router.get(
  "/user/orders/:madonhang",
  authenticateToken,
  getOrderDetail
);

export default router;
