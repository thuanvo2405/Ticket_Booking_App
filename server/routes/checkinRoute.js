import express from "express";
const router = express.Router();
import {
  checkinService,
  getCheckinStatsService,
} from "../models/checkinRoute.js";
import handleResponse from "../utils/handleResponse.js";

router.post("/checkin", async (req, res, next) => {
  try {
    const { qrCode, maSuatDien } = req.body;

    const result = await checkinService(qrCode, maSuatDien);

    handleResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
});

router.get("/checkin-stats", async (req, res, next) => {
  try {
    const { maSuatDien } = req.query;

    if (!maSuatDien) {
      throw new Error("Thiếu mã suất diễn");
    }

    const result = await getCheckinStatsService(maSuatDien);
    handleResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
});

export default router;
