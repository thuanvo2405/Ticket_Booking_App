import express from "express";
import { createEvent } from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authorization.js";
import upload from "../utils/multer.js";
import checkRole from "../middleware/verifyRole.js";

const router = express.Router();

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

export default router;
