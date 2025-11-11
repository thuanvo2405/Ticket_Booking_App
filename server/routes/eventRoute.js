import express from "express";
import {
  createEvent,
  updateEvent,
  updateEventStatus,
  getEventById,
  getEvents,
} from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authorization.js";
import upload from "../utils/multer.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/event", getEventById);
router.get("/events", getEvents);

router.post(
  "/event",
  authenticateToken,
  checkRole(["TO_CHUC"]),
  upload.fields([
    { name: "anhSuKienDoc", maxCount: 1 },
    { name: "anhSuKienNgang", maxCount: 1 },
  ]),
  createEvent
);

router.patch(
  "/event",
  authenticateToken,
  checkRole(["TO_CHUC"]),
  upload.fields([
    { name: "anhSuKienDoc", maxCount: 1 },
    { name: "anhSuKienNgang", maxCount: 1 },
  ]),
  updateEvent
);
router.patch("/event-status", authenticateToken, updateEventStatus);  

export default router;
