import express from "express";
import {
  updatePayment,
  checkTransactionStatus,
  handlePaymentRequest,
  retryPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/callback-payment", updatePayment);
router.post("/transaction-status", checkTransactionStatus);
router.post("/checkout", handlePaymentRequest);
router.post("/retry-checkout", retryPayment);

export default router;
