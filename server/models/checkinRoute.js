import pool from "../config/db.js";
export const checkinService = async (qrCode, maSuatDien) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const ticketRes = await client.query(
      `SELECT v.trangthai, v.qrcode,
              lv.masuatdien,
              sd.thoigianketthuc
       FROM ve v
       JOIN loai_ve lv ON v.maloaive = lv.maloaive
       JOIN suat_dien sd ON lv.masuatdien = sd.masuatdien
       WHERE v.qrcode = $1
       FOR UPDATE`,
      [qrCode],
    );

    if (ticketRes.rowCount === 0) {
      throw new Error("Mã QR không hợp lệ");
    }

    const ticket = ticketRes.rows[0];
    const now = new Date();

    if (ticket.masuatdien !== maSuatDien) {
      throw new Error("Vé không thuộc suất diễn này");
    }

    if (ticket.trangthai === "DA_SU_DUNG") {
      throw new Error("Vé đã được sử dụng");
    }

    if (now > new Date(ticket.thoigianketthuc)) {
      throw new Error("Suất diễn đã kết thúc");
    }

    const updateRes = await client.query(
      `UPDATE ve
   SET trangthai = 'DA_SU_DUNG'
   WHERE qrcode = $1
   AND trangthai = 'CHUA_SU_DUNG'
   RETURNING trangthai, qrcode`,
      [qrCode],
    );

    if (updateRes.rowCount === 0) {
      throw new Error("Vé đã được sử dụng");
    }

    await client.query("COMMIT");

    const updatedTicket = updateRes.rows[0];
    return updatedTicket;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getCheckinStatsService = async (maSuatDien) => {
  const tongQuanRes = await pool.query(
    `
      SELECT
        COUNT(v.qrcode) AS tong_ve,
        COUNT(CASE WHEN v.trangthai = 'DA_SU_DUNG' THEN 1 END) AS da_checkin
      FROM ve v
      JOIN loai_ve lv ON v.maloaive = lv.maloaive
      WHERE lv.masuatdien = $1
      `,
    [maSuatDien],
  );

  const tongVe = Number(tongQuanRes.rows[0].tong_ve);
  const daCheckin = Number(tongQuanRes.rows[0].da_checkin);
  const tiLeCheckin = tongVe > 0 ? Math.round((daCheckin / tongVe) * 100) : 0;

  const theoLoaiVeRes = await pool.query(
    `
      SELECT
        lv.maloaive,
        lv.tenloaive,
        lv.giatien,
        COUNT(v.qrcode) AS tong_ve,
        COUNT(CASE WHEN v.trangthai = 'DA_SU_DUNG' THEN 1 END) AS da_checkin
      FROM loai_ve lv
      LEFT JOIN ve v ON lv.maloaive = v.maloaive
      WHERE lv.masuatdien = $1
      GROUP BY lv.maloaive, lv.tenloaive, lv.giatien
      ORDER BY lv.giatien ASC
      `,
    [maSuatDien],
  );

  const theoLoaiVe = theoLoaiVeRes.rows.map((row) => {
    const tong = Number(row.tong_ve);
    const daCI = Number(row.da_checkin);

    return {
      maloaiVe: row.maloaive,
      tenLoaiVe: row.tenloaive,
      gia: row.giatien,
      tongVe: tong,
      daCheckin: daCI,
      tiLeCheckin: tong > 0 ? Math.round((daCI / tong) * 100) : 0,
    };
  });

  return {
    tongQuan: {
      tongVe,
      daCheckin,
      tiLeCheckin,
    },
    theoLoaiVe,
  };
};
