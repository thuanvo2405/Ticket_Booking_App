import express from "express";
import {
  updatePayment,
  handlePaymentRequest,
  retryPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/callback-payment", updatePayment);
router.post("/checkout", handlePaymentRequest);
router.post("/retry-checkout", retryPayment);

export default router;
