import pool from "../config/db.js";

export const createPromotionService = async (
  maGiamGia,
  giaTriGiam,
  loaiGiam,
  ngayBatDau,
  ngayKetThuc,
  soLuongPhatHanh,
  maSuKien,
  giaTriToiThieu
) => {
  const result = await pool.query(
    "INSERT INTO khuyen_mai (maGiamGia,giaTriGiam,loaiGiam,ngayBatDau,ngayKetThuc,soLuongPhatHanh,maSuKien,giaTriToiThieu) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [
      maGiamGia,
      giaTriGiam,
      loaiGiam,
      ngayBatDau,
      ngayKetThuc,
      soLuongPhatHanh,
      maSuKien,
      giaTriToiThieu,
    ]
  );
  return result.rows[0];
};
