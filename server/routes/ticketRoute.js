import express from "express";
import {
  createTicketType,
  createPerformance,
  getPerformane,
  deletePerformance
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/performance", getPerformane);

router.post("/ticket-type", createTicketType);
router.post("/performance", createPerformance);

router.delete("/performance", deletePerformance);

export default router;
