import express from "express";
import {
  createTicketType,
  createPerformance,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/ticket-type", createTicketType);
router.post("/performance", createPerformance);

export default router;
