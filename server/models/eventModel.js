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
    RETURNING masukien;
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

export const updateEventService = async (
  maSuKien,
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
    UPDATE su_kien
    SET
      tenSuKien = $2,
      moTa = $3,
      diaChi = $4,
      phuong = $5,
      quan = $6,
      thanhPho = $7,
      anhSuKienDoc = COALESCE($8, anhSuKienDoc),
      anhSuKienNgang = COALESCE($9, anhSuKienNgang),
      maToChuc = $10,
      maLoaiSuKien = $11
    WHERE maSuKien = $1
    RETURNING maSuKien;
  `,
    [
      maSuKien,
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

export const updateEventStatusService = async (maSuKien, trangThai) => {
  const result = await pool.query(
    `
    UPDATE su_kien
    SET
      trangthai = $2
    WHERE maSuKien = $1
    RETURNING maSuKien;
  `,
    [maSuKien, trangThai]
  );

  return result.rows[0];
};

export const getEventByIdService = async (maSuKien) => {
  const result = await pool.query(`SELECT * FROM su_kien WHERE maSuKien = $1`, [
    maSuKien,
  ]);
  return result.rows[0];
};

export const getEventsService = async (page, limit, trangThai) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      su_kien.*,
      to_chuc.tentochuc,
      to_chuc.anhtochuc,
      loai_su_kien.tenloaisukien
    FROM su_kien
    JOIN to_chuc ON to_chuc.matochuc = su_kien.matochuc
    JOIN loai_su_kien ON loai_su_kien.maloaisukien = su_kien.maloaisukien
    WHERE su_kien.trangthai != 'NHAP'
  `;

  let countQuery = `SELECT COUNT(*) FROM su_kien WHERE su_kien.trangthai != 'NHAP'`;

  const params = [];
  let paramIndex = 1;

  if (trangThai) {
    query += ` AND su_kien.trangthai = $${paramIndex}  `;
    countQuery += ` AND su_kien.trangthai = $${paramIndex} `;
    params.push(trangThai);
    paramIndex++;
  }

  query += ` ORDER BY su_kien.ngaytao DESC LIMIT $${paramIndex} OFFSET $${
    paramIndex + 1
  }`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  const totalResult = await pool.query(
    countQuery,
    trangThai ? [trangThai] : []
  );
  const total = parseInt(totalResult.rows[0].count, 10);

  return {
    data: result.rows,
    page,
    limit,
    total,
  };
};
