// utils/orderCleanup.js
import cron from "node-cron";
import pool from "../config/db.js"; // PostgreSQL pool

cron.schedule("*/1 * * * *", async () => {
  console.log(` ⏳ Cron Job: Kiểm tra đơn hàng hết hạn...`);

  const client = await pool.connect();

  try {
    const { rows: expiredOrders } = await client.query(`
      SELECT madonhang 
      FROM don_hang
      WHERE trangthai = 'CHO_THANH_TOAN'
      AND thoihanthanhtoan < NOW()
    `);

    if (expiredOrders.length === 0) {
      console.log("✅ Không có đơn hàng nào hết hạn.");
      return;
    }

    for (const order of expiredOrders) {
      const { madonhang } = order;

      try {
        await client.query("BEGIN");

        const { rows: details } = await client.query(
          `SELECT maloaiVe, soluong 
           FROM chi_tiet_don_hang 
           WHERE madonhang = $1`,
          [madonhang]
        );

        for (const item of details) {
          await client.query(
            `UPDATE loai_ve
             SET soluongkhoa = GREATEST(soluongkhoa - $1, 0)
             WHERE maloaiVe = $2`,
            [item.soluong, item.maloaive]
          );
        }

        await client.query(
          `UPDATE don_hang
           SET trangthai = 'HET_HAN'
           WHERE madonhang = $1`,
          [madonhang]
        );

        await client.query("COMMIT");
        console.log(
          `❌ Đơn hàng ${madonhang} đã hết hạn & giải phóng vé thành công.`
        );
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`❌ Lỗi xử lý đơn hàng ${madonhang}:`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Cron job lỗi:", err.message);
  } finally {
    client.release();
  }
});

console.log("✅ Cron job order cleanup đã được khởi chạy mỗi phút.");
