import express from "express";
import {
  createTicketType,
  createPerformance,
  getPerformane,
  deletePerformance,
  getTicketType,
  deleteTicketType,
} from "../controllers/ticketController.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/performance", getPerformane);
router.get("/ticket-type", getTicketType);

router.post("/ticket-type", authenticateToken, createTicketType);
router.post("/performance", authenticateToken, createPerformance);

router.delete("/performance", authenticateToken, deletePerformance);
router.delete("/ticket-type", authenticateToken, deleteTicketType);

export default router;
