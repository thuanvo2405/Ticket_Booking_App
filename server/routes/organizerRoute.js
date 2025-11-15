import express from "express";
import {
  createOrganizerProfile,
  getOrganizerProfile,
  updateOrganizerProfile,
} from "../controllers/organizerController.js";
import upload from "../utils/multer.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/organizer-profile", authenticateToken, getOrganizerProfile);
router.post(
  "/organizer-profile",
  authenticateToken,
  upload.single("media"),
  createOrganizerProfile
);

router.patch(
  "/organizer-profile",
  authenticateToken,
  upload.single("anhtochuc"),
  updateOrganizerProfile
);

export default router;
