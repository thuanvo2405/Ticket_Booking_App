import express from "express";
import {
  createPayment,
  updatePayment,
  checkTransactionStatus,
  handlePaymentRequest,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payment", createPayment);
router.post("/callback-payment", updatePayment);
router.post("/transaction-status", checkTransactionStatus);
router.post("/checkout", handlePaymentRequest);

export default router;
