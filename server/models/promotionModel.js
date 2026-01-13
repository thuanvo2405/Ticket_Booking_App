import pool from "../config/db.js";

export const getPromotionsService = async (maSuKien) => {
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
  await pool.query("DELETE FROM khuyen_mai WHERE makhuyenmai = $1", [
    maKhuyenMai,
  ]);
};

export const updatePromotionService = async (
  maKhuyenMai,
  maGiamGia,
  giaTriGiam,
  loaiGiam,
  ngayBatDau,
  ngayKetThuc,
  soLuongPhatHanh,
  giaTriToiThieu
) => {
  const result = await pool.query(
    `
    UPDATE khuyen_mai
    SET maGiamGia = $1,
        giaTriGiam = $2,
        loaiGiam = $3,
        ngayBatDau = $4,
        ngayKetThuc = $5,
        soLuongPhatHanh = $6,
        giaTriToiThieu = $7
    WHERE maKhuyenMai = $8
    RETURNING *
    `,
    [
      maGiamGia,
      giaTriGiam,
      loaiGiam,
      ngayBatDau,
      ngayKetThuc,
      soLuongPhatHanh,
      giaTriToiThieu,
      maKhuyenMai,
    ]
  );

  return result.rows[0];
};
