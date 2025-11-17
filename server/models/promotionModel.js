import e from "express";
import pool from "../config/db.js";

export const getPromotionsService = async (maSuKien) => {
  console.log(maSuKien);
  const result = await pool.query(
    "SELECT * FROM khuyen_mai wHERE maSuKien = $1",
    [maSuKien]
  );
  return result.rows;
};

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

export const deletePromotionService = async (maKhuyenMai) => {
  await pool.query("DELETE FROM khuyen_mai WHERE maGiamGia = $1", [
    maKhuyenMai,
  ]);
};
