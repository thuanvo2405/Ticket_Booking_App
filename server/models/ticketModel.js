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

export const updatePerformanceService = async (
  thoiGianBatDau,
  thoiGianKetThuc,
  maSuatDien
) => {
  const result = await pool.query(
    `
    UPDATE suat_dien
    SET thoigianbatdau = $1,
        thoigianketthuc = $2
    WHERE masuatdien = $3
    RETURNING *
  `,
    [thoiGianBatDau, thoiGianKetThuc, maSuatDien]
  );

  return result.rows[0];
};

export const updateTicketTypeService = async (
  tenLoaiVe,
  moTa,
  giaTien,
  soLuongPhatHanh,
  maLoaiVe
) => {
  const result = await pool.query(
    `
      UPDATE loai_ve
      SET tenloaive = $1,
          mota = $2,
          giatien = $3,
          soluongphathanh = $4
      WHERE maloaive = $5
      RETURNING *
    `,
    [tenLoaiVe, moTa, giaTien, soLuongPhatHanh, maLoaiVe]
  );

  if (result.rowCount === 0) {
    throw new Error("Không tìm thấy loại vé", 404);
  }

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

export const ticketTypeByPerformanceIDService = async (maSuatDien) => {
  const result = await pool.query(
    `SELECT 
  json_build_object(
    'masuatdien', sd.masuatdien,
    'thoigianbatdau', sd.thoigianbatdau,
    'thoigianketthuc', sd.thoigianketthuc,
    'trangthai', sd.trangthai,
    'tensukien', sk.tensukien,
    'phuong', sk.phuong,
    'quan', sk.quan,
    'thanhpho', sk.thanhpho,
    'diachi', sk.diachi,
    'suatdien', json_agg(
      json_build_object(
        'tenloaive', lv.tenloaive,
        'maloaive', lv.maloaive,
        'giatien', lv.giatien,
        'soluongphathanh', lv.soluongphathanh,
        'soluongdaban', lv.soluongdaban,
        'soluongkhoa', lv.soluongkhoa,
        'mota', lv.mota
      )
    )
  ) AS result
  FROM suat_dien sd
  JOIN loai_ve lv ON lv.masuatdien = sd.masuatdien
  JOIN su_kien sk ON sk.masukien = sd.masukien
  WHERE sd.masuatdien = $1
  GROUP BY sd.masuatdien, sd.thoigianbatdau, sd.thoigianketthuc, sd.trangthai, sk.tensukien, sk.phuong, sk.quan, sk.thanhpho, sk.diachi;
  `,
    [maSuatDien]
  );

  return result.rows[0].result;
};
