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
    sk.maloaisukien,
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
  khuVuc,
  tenLoaiSuKien,
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

  if (from && to) {
    conditions.push(`
      EXISTS (
        SELECT 1 FROM suat_dien sd
        WHERE sd.masukien = sk.masukien
        AND sd.thoigianbatdau::date <= $${params.length + 2}::date
        AND sd.thoigianketthuc::date >= $${params.length + 1}::date
      )
    `);
    params.push(from, to);
  }

  if (khuVuc && khuVuc !== "Toàn quốc") {
    if (khuVuc === "Khác") {
      conditions.push(
        `sk.thanhpho NOT IN ('Thành phố Hồ Chí Minh', 'Thành phố Hà Nội', 'Thành phố Đà Nẵng')`
      );
    } else {
      conditions.push(`sk.thanhpho ILIKE $${params.length + 1}`);
      params.push(`%${khuVuc}%`);
    }
  }

  if (tenLoaiSuKien) {
    if (tenLoaiSuKien === "Khác") {
      conditions.push(
        `lsk.tenloaisukien NOT IN ('Âm Nhạc', 'Sân Khấu và Nghệ Thuật', 'Thể Thao')`
      );
    } else {
      conditions.push(`lsk.tenloaisukien = $${params.length + 1}`);
      params.push(tenLoaiSuKien);
    }
  }

  if (tenSuKien) {
    params.push(`%${tenSuKien}%`);
    conditions.push(`unaccent(sk.tensukien) ILIKE unaccent($${params.length})`);
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
      sk.diachi,
      sk.phuong,
      sk.quan,
      sk.thanhpho,
      sk.mota,
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
    SELECT COUNT(*) 
    FROM su_kien sk
    JOIN loai_su_kien lsk ON lsk.maloaisukien = sk.maloaisukien
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

export const getEventByOrganizerIdService = async (matochuc, trangThai) => {
  let conditions = ["matochuc = $1"];
  let params = [matochuc];

  if (trangThai) {
    conditions.push(`trangthai = $2`);
    params.push(trangThai);
  }

  const sql = `
    SELECT masukien, anhsukienngang, tensukien, diachi, phuong, quan, thanhpho, trangthai
    FROM su_kien
    WHERE ${conditions.join(" AND ")}
  `;

  const result = await pool.query(sql, params);
  return result.rows;
};

export const getEventTypesService = async () => {
  const result = await pool.query("Select * from loai_su_kien");
  return result.rows;
};

export const deleteEventService = async (maSuKien) => {
  const result = await pool.query(
    `DELETE FROM su_kien WHERE maSuKien = $1 RETURNING maSuKien;`,
    [maSuKien]
  );
  return result.rows[0];
};

export const getEventsByCategoryService = async () => {
  const categories = ["Âm Nhạc", "Workshop", "Khác"];

  const result = await pool.query(
    `SELECT 
        sk.masukien,
        sk.tensukien,
        sk.anhsukienngang,
        sk.trangthai,
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
      WHERE sk.trangthai = 'DA_DUYET'
      ORDER BY (
        SELECT MIN(sd.thoigianbatdau)
        FROM suat_dien sd
        WHERE sd.masukien = sk.masukien
      ) ASC`
  );

  const grouped = {};
  categories.forEach((c) => (grouped[c] = []));

  result.rows.forEach((e) => {
    const categoryName = e.tenloaisukien;
    if (grouped[categoryName]) grouped[categoryName].push(e);
    else grouped[categoryName] = [e];
  });

  return grouped;
};

export const getEventsForUserService = async ({
  page = 1,
  limit = 12,
  tenSuKien,
  from,
  to,
  khuVuc,
  tenLoaiSuKien,
}) => {
  const offset = (page - 1) * limit;
  const conditions = ["sk.trangthai = 'DA_DUYET'"];
  const params = [];

  if (tenSuKien) {
    params.push(`%${tenSuKien}%`);
    conditions.push(`unaccent(sk.tensukien) ILIKE unaccent($${params.length})`);
  }

  if (khuVuc && khuVuc !== "Toàn quốc") {
    if (khuVuc === "Khác") {
      conditions.push(
        `sk.thanhpho NOT IN ('Thành phố Hồ Chí Minh', 'Thành phố Hà Nội', 'Thành phố Đà Nẵng')`
      );
    } else {
      params.push(`%${khuVuc}%`);
      conditions.push(`sk.thanhpho ILIKE $${params.length}`);
    }
  }

  if (tenLoaiSuKien) {
    if (tenLoaiSuKien === "Khác") {
      conditions.push(
        `lsk.tenloaisukien NOT IN ('Âm Nhạc', 'Sân Khấu', 'Thể Thao','Workshop')`
      );
    } else {
      params.push(tenLoaiSuKien);
      conditions.push(`lsk.tenloaisukien = $${params.length}`);
    }
  }

  if (from && to) {
    params.push(from, to);
    conditions.push(`
      EXISTS (
        SELECT 1 FROM suat_dien sd
        WHERE sd.masukien = sk.masukien
        AND sd.thoigianbatdau::date <= $${params.length}::date
        AND sd.thoigianketthuc::date >= $${params.length - 1}::date
      )
    `);
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
    SELECT COUNT(*) 
    FROM su_kien sk
    JOIN loai_su_kien lsk ON lsk.maloaisukien = sk.maloaisukien
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

export const getSpecialEventService = async () => {
  const result = await pool.query(
    `SELECT *
     FROM (
        SELECT DISTINCT su_kien.maSuKien,
                        su_kien.anhSuKienNgang,
                        su_kien.anhSuKienDoc
        FROM su_kien
        JOIN suat_dien ON su_kien.maSuKien = suat_dien.maSuKien
        WHERE suat_dien.thoiGianBatDau > NOW()
     ) AS unique_events
     ORDER BY RANDOM()
     LIMIT 5;`
  );

  return result.rows;
};

export const getMaybeLikeEventService = async () => {
  const result = await pool.query(
    `
    WITH next_performance AS (
      SELECT
        sd.masukien,
        sd.masuatdien,
        sd.thoigianbatdau,
        sd.thoigianketthuc,
        ROW_NUMBER() OVER (
          PARTITION BY sd.masukien
          ORDER BY sd.thoigianbatdau
        ) AS rn,
        MIN(lv.giatien) OVER (PARTITION BY sd.masuatdien) AS min_price
      FROM suat_dien sd
      JOIN loai_ve lv ON lv.masuatdien = sd.masuatdien
      WHERE sd.thoigianbatdau > NOW()
      )
      SELECT 
        sk.masukien,
        sk.anhsukienngang,
        np.thoigianbatdau AS suat_dien,
        np.min_price AS gia
      FROM su_kien sk
      JOIN next_performance np 
        ON np.masukien = sk.masukien AND np.rn = 1
      ORDER BY RANDOM()
      LIMIT 8;
    `
  );

  return result.rows;
};

export const getEventStatisticsService = async (maSuKien) => {
  const totalsRes = await pool.query(
    `
    SELECT 
      COALESCE(SUM(ct.soluong), 0) AS total_tickets,
      COALESCE(SUM(dh.tongtien), 0) AS total_revenue,
      COUNT(DISTINCT dh.madonhang) FILTER (WHERE dh.trangthai = 'DA_THANH_TOAN') AS total_orders
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    WHERE sd.masukien = $1
      AND dh.trangthai = 'DA_THANH_TOAN'
  `,
    [maSuKien]
  );

  const ordersRes = await pool.query(
    `
    SELECT DISTINCT 
      dh.madonhang,
      dh.trangthai,
      dh.tongtien,
      dh.ngaydatve,
      dh.thoigianthanhtoan,
      nd.tennguoidung,
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'maSuatDien', sd.masuatdien,
          'thoiGianBatDau', sd.thoigianbatdau,
          'thoiGianKetThuc', sd.thoigianketthuc
        )
      ) FILTER (WHERE sd.masuatdien IS NOT NULL) AS performances
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    JOIN nguoi_dung nd ON nd.manguoidung = dh.manguoidung
    WHERE sd.masukien = $1
      AND dh.trangthai = 'DA_THANH_TOAN'
    GROUP BY dh.madonhang, dh.trangthai, dh.tongtien, dh.ngaydatve, dh.thoigianthanhtoan, nd.tennguoidung
    ORDER BY dh.ngaydatve DESC
  `,
    [maSuKien]
  );

  return {
    totalTickets: Number(totalsRes.rows[0].total_tickets),
    totalRevenue: Number(totalsRes.rows[0].total_revenue),
    totalOrders: Number(totalsRes.rows[0].total_orders),
    orders: ordersRes.rows,
  };
};

export const getOrderDetailForEventService = async (maSuKien, maDonHang) => {
  const orderRes = await pool.query(
    `
    SELECT 
      dh.madonhang,
      dh.trangthai,
      dh.tongtien,
      dh.ngaydatve,
      dh.thoigianthanhtoan
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    WHERE dh.madonhang = $1 AND sd.masukien = $2 AND dh.trangthai = 'DA_THANH_TOAN'
  `,
    [maDonHang, maSuKien]
  );

  if (orderRes.rowCount === 0) {
    return null;
  }

  const itemsRes = await pool.query(
    `
    SELECT 
      ct.maloaive,
      lv.tenloaive,
      ct.soluong,
      ct.dongia,
      ct.thanhtien,
      sd.masuatdien,
      sd.thoigianbatdau,
      sd.thoigianketthuc
    FROM chi_tiet_don_hang ct
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    WHERE ct.madonhang = $1
  `,
    [maDonHang]
  );

  return {
    order: orderRes.rows[0],
    items: itemsRes.rows,
  };
};
