import express from "express";
import {
  createEvent,
  updateEvent,
  updateEventStatus,
  getEventById,
  getEvents,
  getEventByOrganizerId,
  getEventTypes,
  deleteEvent,
  getEventsByCategory,
  getEventsForUser,
  getSpecialEvent,
} from "../controllers/eventController.js";
import {
  authenticateToken,
  parseTokenIfExists,
} from "../middleware/authorization.js";
import upload from "../utils/multer.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/event", getEventById);
router.get("/events", parseTokenIfExists, getEvents);
router.get("/organizer/events", authenticateToken, getEventByOrganizerId);
router.get("/event-types", getEventTypes);
router.get("/events_suggest", getEventsByCategory);
router.get("/events_special", getSpecialEvent);
router.get("/user/events", getEventsForUser);

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

router.delete("/event/", authenticateToken, deleteEvent);

export default router;
