import pool from "../config/db.js";

export const createTicketTypeService = async (
  tenLoaiVe,
  moTa,
  giaTien,
  soLuongPhatHanh,
  maSuatDien
) => {
  const result = await pool.query(
    "INSERT INTO loai_ve(tenloaive,mota,giatien,soluongphathanh,masuatdien) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [tenLoaiVe, moTa, giaTien, soLuongPhatHanh, maSuatDien]
  );

  return result.rows[0];
};

export const createPerformanceService = async (
  thoiGianBatDau,
  thoiGianKetThuc,
  maSuKien
) => {
  const result = await pool.query(
    "INSERT INTO suat_dien(thoigianbatdau,thoigianketthuc,masukien) VALUES ($1,$2,$3) RETURNING *",
    [thoiGianBatDau, thoiGianKetThuc, maSuKien]
  );

  return result.rows[0];
};

export const getPerformaneService = async (maSuKien) => {
  const result = await pool.query(
    "Select * from suat_dien where masukien = $1",
    [maSuKien]
  );

  return result.rows;
};

export const deletePerformanceService = async (maSuatDien) => {
  const result = await pool.query(
    "Delete from suat_dien where masuatdien = $1",
    [maSuatDien]
  );

  return result.rows;
};

export const getTicketTypeService = async (maSuatDien) => {
  const result = await pool.query(
    "Select * from loai_ve where masuatdien = $1",
    [maSuatDien]
  );

  return result.rows;
};

export const deleteTicketTypeService = async (maLoaiVe) => {
  const result = await pool.query("Delete from loai_ve where maloaive = $1", [
    maLoaiVe,
  ]);

  return result.rows;
};
