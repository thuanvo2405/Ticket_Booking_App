import express from "express";
import {
  createTicketType,
  createPerformance,
  getPerformane,
  deletePerformance,
  getTicketType,
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/performance", getPerformane);
router.get("/ticket-type", getTicketType);

router.post("/ticket-type", createTicketType);
router.post("/performance", createPerformance);

router.delete("/performance", deletePerformance);

export default router;
