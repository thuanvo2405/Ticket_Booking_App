import pool from "../config/db.js";

export const createEventService = async (
  tenSuKien,
  moTa,
  diaChi,
  phuong,
  quan,
  thanhPho,
  maToChuc,
  maLoaiSuKien,
  diaChiAnhNgang,
  diaChiAnhDoc
) => {
  const result = await pool.query(
    `
    INSERT INTO su_kien (
      tenSuKien,
      moTa,
      diaChi,
      phuong,
      quan,
      thanhPho,
      anhSuKienDoc,
      anhSuKienNgang,
      maToChuc,
      maLoaiSuKien
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10
    )
    RETURNING maSuKien, trangThai, ngayTao;
  `,
    [
      tenSuKien,
      moTa,
      diaChi,
      phuong,
      quan,
      thanhPho,
      diaChiAnhDoc,
      diaChiAnhNgang,
      maToChuc,
      maLoaiSuKien,
    ]
  );

  return result.rows[0];
};
