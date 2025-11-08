import pool from "../config/db.js";

export const createTicketTypeService = async (
  tenLoaiVe,
  moTa,
  giaTien,
  soLuongPhatHanh,
  maSuKien
) => {
  const result = await pool.query(
    "INSERT INTO loai_ve(tenloaive,mota,giatien,soluongphathanh,masukien) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [tenLoaiVe, moTa, giaTien, soLuongPhatHanh, maSuKien]
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
    [thoiGianBatDau, thoiGianKetThuc, "9c13895f-daf4-4278-b691-5b49b070dbc1"]
  );

  return result.rows[0];
};
