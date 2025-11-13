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

export const isExist = async (maSuKien) => {
  const result = await pool.query(`SELECT * FROM su_kien WHERE maSuKien = $1`, [
    maSuKien,
  ]);
  return result.rows[0];
};

export const getEventByIdService = async (maSuKien) => {
  const result = await pool.query(
    ` SELECT 
    sk.masukien,
    sk.tensukien,
    sk.anhsukiendoc,
    sk.anhsukienngang,
    sk.trangthai,
    sk.mota,
    sk.diachi,
    sk.phuong,
    sk.quan,
    sk.thanhpho,
    tc.tentochuc,
    tc.anhtochuc,
    tc.mota AS mota_tochuc,
    lsk.tenloaisukien,
   (
    SELECT json_agg(
      json_build_object(
        'maSuatDien', sd.masuatdien,
        'thoigianbatdau', sd.thoigianbatdau,
        'thoigianketthuc', sd.thoigianketthuc,
        'loaiVe', (
          SELECT json_agg(
            json_build_object(
              'maLoaiVe', lv.maloaive,
              'tenLoaiVe', lv.tenloaive,
              'giaTien', lv.giaTien,
              'moTa', lv.moTa
            ) ORDER BY lv.giaTien ASC
          )
          FROM loai_ve lv
          WHERE lv.masuatdien = sd.masuatdien
        )
      ) ORDER BY sd.thoigianbatdau ASC
    )
    FROM suat_dien sd
    WHERE sd.masukien = sk.masukien
    ) AS suat_dien
    FROM su_kien sk
    JOIN to_chuc tc ON tc.matochuc = sk.matochuc
    JOIN loai_su_kien lsk ON lsk.maloaisukien = sk.maloaisukien
    WHERE maSuKien = $1`,
    [maSuKien]
  );
  return result.rows[0];
};

export const getEventsService = async ({
  page = 1,
  limit = 10,
  trangThai,
  from,
  to,
  viTri,
  maLoaiSuKien,
  role,
  maToChuc,
  tenSuKien,
}) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (role === "TO_CHUC" && maToChuc) {
    conditions.push(`sk.matochuc = $${params.length + 1}`);
    params.push(maToChuc);
  } else if (!role || role === "KHACH_HANG") {
    conditions.push(`sk.trangthai = 'DA_DUYET'`);
  } else if (role === "QUAN_TRI") {
    conditions.push(`sk.trangthai != 'NHAP'`);
  }

  if (trangThai) {
    conditions.push(`sk.trangthai = $${params.length + 1}`);
    params.push(trangThai);
  }
  if (from) {
    conditions.push(`sk.ngaytao >= $${params.length + 1}`);
    params.push(from);
  }
  if (to) {
    conditions.push(`sk.ngaytao <= $${params.length + 1}`);
    params.push(to);
  }
  if (viTri) {
    conditions.push(`sk.vitri ILIKE $${params.length + 1}`);
    params.push(`%${viTri}%`);
  }
  if (maLoaiSuKien) {
    conditions.push(`sk.maloaisukien = $${params.length + 1}`);
    params.push(maLoaiSuKien);
  }
  if (tenSuKien) {
    conditions.push(`sk.tensukien ILIKE $${params.length + 1}`);
    params.push(`%${tenSuKien}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const query = `
  SELECT 
    sk.masukien,
    sk.tensukien,
    sk.anhsukiendoc,
    sk.anhsukienngang,
    sk.trangthai,
    tc.tentochuc,
    lsk.tenloaisukien,
    (
      SELECT json_agg(
        json_build_object(
          'maSuatDien', sd.masuatdien,
          'thoigianbatdau', sd.thoigianbatdau,
          'thoigianketthuc', sd.thoigianketthuc,
          'loaiVe', (
            SELECT json_agg(
              json_build_object(
                'maLoaiVe', lv.maloaive,
                'tenLoaiVe', lv.tenloaive,
                'giaTien', lv.giaTien
              ) ORDER BY lv.giaTien ASC
            )
            FROM loai_ve lv
            WHERE lv.masuatdien = sd.masuatdien
          )
        ) ORDER BY sd.thoigianbatdau ASC
      )
      FROM suat_dien sd
      WHERE sd.masukien = sk.masukien
    ) AS suat_dien
  FROM su_kien sk
  JOIN to_chuc tc ON tc.matochuc = sk.matochuc
  JOIN loai_su_kien lsk ON lsk.maloaisukien = sk.maloaisukien
  ${whereClause}
  ORDER BY sk.ngaytao DESC
  LIMIT ${limit} OFFSET ${offset};
  `;

  const countQuery = `
    SELECT COUNT(*) FROM su_kien sk
    ${whereClause};
  `;

  const result = await pool.query(query, params);
  const totalResult = await pool.query(countQuery, params);

  return {
    data: result.rows,
    page,
    limit,
    total: parseInt(totalResult.rows[0].count, 10),
  };
};
