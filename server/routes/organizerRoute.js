import express from "express";
import {
  createOrganizerProfile,
  getOrganizerProfile,
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

export default router;
