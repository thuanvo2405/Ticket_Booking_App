import cron from "node-cron";
import pool from "../config/db.js";

cron.schedule("*/30 * * * *", async () => {
  console.log(
    "⏳ Cron: Cập nhật sự kiện đã diễn ra (chỉ áp dụng sự kiện đã duyệt)..."
  );

  try {
    const res = await pool.query(`
      UPDATE su_kien sk
      SET trangthai = 'DA_DIEN_RA'
      WHERE sk.trangthai = 'DA_DUYET'
      AND NOT EXISTS (
          SELECT 1
          FROM suat_dien sd
          WHERE sd.masukien = sk.masukien
          AND sd.thoigianbatdau >= NOW()
      )
      RETURNING sk.masukien;
    `);

    if (res.rowCount > 0) {
      console.log(`🎉 ${res.rowCount} sự kiện đã chuyển sang DA_DIEN_RA`);
    } else {
      console.log("👍 Không có sự kiện nào cần cập nhật.");
    }
  } catch (err) {
    console.error("❌ Cron lỗi:", err.message);
  }
});

console.log("✅ Cron cập nhật sự kiện chạy mỗi 30 phút.");
