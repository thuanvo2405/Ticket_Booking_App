import express from "express";
import {
  getTotalUser,
  getActiveEvents,
  getPendingEvents,
  getRevenueToday,
  getRevenue,
  getSummary
} from "../controllers/reportController.js";
import { authenticateToken } from "../middleware/authorization.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get(
  "/report-total-users",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getTotalUser
);

router.get(
  "/report-total-active-events",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getActiveEvents
);

router.get(
  "/report-total-pending-events",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getPendingEvents
);

router.get(
  "/report-revenue-today",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getRevenueToday
);

router.get(
  "/report-summary",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getSummary
);

router.get(
  "/report-revenue",
  authenticateToken,
  checkRole(["QUAN_TRI"]),
  getRevenue
);

export default router;
