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
              'moTa', lv.moTa,
              'soLuongPhatHanh', lv.soluongphathanh,
              'soLuongDaBan', lv.soluongdaban,
              'soLuongKhoa', lv.soluongkhoa,
              'soLuongConLai',
                GREATEST(
                  COALESCE(lv.soluongphathanh, 0) - COALESCE(lv.soluongdaban, 0) - COALESCE(lv.soluongkhoa, 0),
                  0
                )
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

export const getEventByOrganizerIdService = async ({
  matochuc,
  trangThai,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;
  const conditions = ["sk.matochuc = $1"];
  const params = [matochuc];

  if (trangThai) {
    conditions.push(`sk.trangthai = $${params.length + 1}`);
    params.push(trangThai);
  }

  const whereClause = conditions.join(" AND ");

  const dataQuery = `
    SELECT 
      sk.masukien,
      sk.anhsukienngang,
      sk.tensukien,
      sk.trangthai,
      lsk.tenloaisukien
    FROM su_kien sk
    JOIN loai_su_kien lsk ON lsk.maloaisukien = sk.maloaisukien
    WHERE ${whereClause}
    ORDER BY sk.ngaytao DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2};
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM su_kien sk
    WHERE ${whereClause};
  `;

  const result = await pool.query(dataQuery, [...params, limit, offset]);
  const totalResult = await pool.query(countQuery, params);

  return {
    data: result.rows,
    page,
    limit,
    total: parseInt(totalResult.rows[0].count, 10),
  };
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
  const categoriesRes = await pool.query(
    "SELECT tenloaisukien FROM loai_su_kien ORDER BY tenloaisukien ASC"
  );
  const categories = categoriesRes.rows.map((c) => c.tenloaisukien);

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
    if (!grouped[categoryName]) grouped[categoryName] = [];
    grouped[categoryName].push(e);
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
  const conditions = ["sk.trangthai IN ('DA_DUYET', 'DA_DIEN_RA')"];
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
        SELECT MIN(sd.thoigianbatdau)
        FROM suat_dien sd
        WHERE sd.masukien = sk.masukien
      ) AS min_start,
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
    ORDER BY 
      CASE 
        WHEN (
          SELECT MIN(sd.thoigianbatdau) FROM suat_dien sd WHERE sd.masukien = sk.masukien
        ) >= NOW() THEN 0
        ELSE 1
      END,
      min_start ASC NULLS LAST
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
        WHERE suat_dien.thoiGianBatDau > NOW() AND su_kien.trangthai = 'DA_DUYET'
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
        sk.tensukien,
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

const toSafeNumber = (value) => Number(value ?? 0);

const buildChartSeries = (rows, windowSize, mode) => {
  const byKey = rows.reduce((acc, row) => {
    const date = mode === "daily" ? new Date(row.date) : new Date(row.hour);
    if (Number.isNaN(date.getTime())) return acc;
    const key =
      mode === "daily"
        ? date.toISOString().slice(0, 10)
        : date.toISOString().slice(0, 13);
    acc.set(key, {
      tickets: toSafeNumber(row.tickets),
      revenue: toSafeNumber(row.revenue),
    });
    return acc;
  }, new Map());

  const now = new Date();
  const series = [];
  const cursor = new Date(now);

  for (let i = windowSize - 1; i >= 0; i--) {
    if (mode === "daily") {
      const day = new Date(cursor);
      day.setHours(0, 0, 0, 0);
      day.setDate(cursor.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const label = `${day.getDate().toString().padStart(2, "0")}/${(
        day.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      const point = byKey.get(key);
      series.push({
        date: label,
        tickets: point?.tickets ?? 0,
        revenue: point?.revenue ?? 0,
      });
    } else {
      const hour = new Date(cursor);
      hour.setMinutes(0, 0, 0);
      hour.setHours(cursor.getHours() - i);
      const key = hour.toISOString().slice(0, 13);
      const label = `${hour.getHours().toString().padStart(2, "0")}:00`;
      const point = byKey.get(key);
      series.push({
        date: label,
        tickets: point?.tickets ?? 0,
        revenue: point?.revenue ?? 0,
      });
    }
  }

  return series;
};

export const getEventOverviewService = async (maSuKien) => {
  const [totalsRes, capacityRes, sessionsRes] = await Promise.all([
    pool.query(
      `
      SELECT 
        COALESCE(SUM(ct.soluong), 0) AS total_tickets,
        COALESCE(SUM(ct.thanhtien), 0) AS total_revenue,
        COUNT(DISTINCT dh.madonhang) FILTER (WHERE dh.trangthai = 'DA_THANH_TOAN') AS total_orders
      FROM don_hang dh
      JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
      JOIN loai_ve lv ON lv.maloaive = ct.maloaive
      JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
      WHERE sd.masukien = $1
        AND dh.trangthai = 'DA_THANH_TOAN'
    `,
      [maSuKien]
    ),
    pool.query(
      `
      SELECT 
        COALESCE(SUM(lv.soluongphathanh), 0) AS total_tickets,
        COALESCE(SUM(lv.soluongdaban), 0) AS sold_tickets,
        COALESCE(SUM(lv.soluongkhoa), 0) AS locked_tickets,
        COALESCE(SUM(lv.giatien * lv.soluongphathanh), 0) AS potential_revenue
      FROM loai_ve lv
      JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
      WHERE sd.masukien = $1
    `,
      [maSuKien]
    ),
    pool.query(
      `
      SELECT 
        sd.masuatdien,
        sd.thoigianbatdau,
        sd.thoigianketthuc,
        COALESCE(SUM(lv.soluongphathanh), 0) AS total_tickets,
        COALESCE(SUM(lv.soluongdaban), 0) AS sold_tickets,
        COALESCE(SUM(lv.soluongkhoa), 0) AS locked_tickets,
        COALESCE(SUM(lv.giatien * lv.soluongphathanh), 0) AS potential_revenue,
        COALESCE(SUM(lv.giatien * lv.soluongdaban), 0) AS revenue
      FROM suat_dien sd
      LEFT JOIN loai_ve lv ON lv.masuatdien = sd.masuatdien
      WHERE sd.masukien = $1
      GROUP BY sd.masuatdien
      ORDER BY sd.thoigianbatdau ASC
    `,
      [maSuKien]
    ),
  ]);

  const sessions = sessionsRes.rows.map((session) => ({
    maSuatDien: session.masuatdien,
    thoiGianBatDau: session.thoigianbatdau,
    thoiGianKetThuc: session.thoigianketthuc,
    totalTickets: toSafeNumber(session.total_tickets),
    soldTickets: toSafeNumber(session.sold_tickets),
    lockedTickets: toSafeNumber(session.locked_tickets),
    potentialRevenue: toSafeNumber(session.potential_revenue),
    revenue: toSafeNumber(session.revenue),
  }));

  return {
    overview: {
      totalTickets: toSafeNumber(capacityRes.rows[0].total_tickets),
      soldTickets: toSafeNumber(capacityRes.rows[0].sold_tickets),
      lockedTickets: toSafeNumber(capacityRes.rows[0].locked_tickets),
      totalRevenue: toSafeNumber(totalsRes.rows[0].total_revenue),
      potentialRevenue: toSafeNumber(capacityRes.rows[0].potential_revenue),
      totalOrders: toSafeNumber(totalsRes.rows[0].total_orders),
    },
    sessions,
  };
};

export const getSessionStatisticsService = async (maSuKien, maSuatDien) => {
  const [baseRes, ticketTypesRes, revenueRes] = await Promise.all([
    pool.query(
      `
      SELECT 
        COALESCE(SUM(lv.soluongphathanh), 0) AS total_tickets,
        COALESCE(SUM(lv.soluongdaban), 0) AS sold_tickets,
        COALESCE(SUM(lv.soluongkhoa), 0) AS locked_tickets,
        COALESCE(SUM(lv.giatien * lv.soluongphathanh), 0) AS potential_revenue
      FROM loai_ve lv
      JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
      WHERE sd.masuatdien = $1 AND sd.masukien = $2
    `,
      [maSuatDien, maSuKien]
    ),
    pool.query(
      `
      SELECT 
        lv.maloaive,
        lv.tenloaive,
        lv.giatien,
        lv.soluongphathanh,
        lv.soluongdaban,
        lv.soluongkhoa
      FROM loai_ve lv
      JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
      WHERE sd.masuatdien = $1 AND sd.masukien = $2
      ORDER BY lv.giatien ASC
    `,
      [maSuatDien, maSuKien]
    ),
    pool.query(
      `
      SELECT 
        COALESCE(SUM(ct.soluong), 0) AS sold_tickets,
        COALESCE(SUM(ct.thanhtien), 0) AS revenue
      FROM don_hang dh
      JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
      JOIN loai_ve lv ON lv.maloaive = ct.maloaive
      WHERE dh.trangthai = 'DA_THANH_TOAN'
        AND lv.masuatdien = $1
    `,
      [maSuatDien]
    ),
  ]);

  return {
    session: {
      maSuatDien,
      soldTickets: toSafeNumber(baseRes.rows[0].sold_tickets),
      totalTickets: toSafeNumber(baseRes.rows[0].total_tickets),
      lockedTickets: toSafeNumber(baseRes.rows[0].locked_tickets),
      revenue: toSafeNumber(revenueRes.rows[0].revenue),
      potentialRevenue: toSafeNumber(baseRes.rows[0].potential_revenue),
      ticketTypes: ticketTypesRes.rows.map((row) => ({
        type: row.tenloaive,
        price: toSafeNumber(row.giatien),
        sold: toSafeNumber(row.soluongdaban),
        total: toSafeNumber(row.soluongphathanh),
        locked: toSafeNumber(row.soluongkhoa),
        maLoaiVe: row.maloaive,
      })),
    },
  };
};

export const getSessionChartService = async (maSuatDien, range) => {
  const isDaily = range === "30d";
  const windowSize = isDaily ? 30 : 24;
  const query = isDaily
    ? `
    SELECT 
      DATE(dh.thoigianthanhtoan) AS date,
      SUM(ct.soluong) AS tickets,
      SUM(ct.thanhtien) AS revenue
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    WHERE dh.trangthai = 'DA_THANH_TOAN'
      AND lv.masuatdien = $1
      AND dh.thoigianthanhtoan >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(dh.thoigianthanhtoan)
    ORDER BY date ASC
  `
    : `
    SELECT 
      DATE_TRUNC('hour', dh.thoigianthanhtoan) AS hour,
      SUM(ct.soluong) AS tickets,
      SUM(ct.thanhtien) AS revenue
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    WHERE dh.trangthai = 'DA_THANH_TOAN'
      AND lv.masuatdien = $1
      AND dh.thoigianthanhtoan >= NOW() - INTERVAL '24 hours'
    GROUP BY DATE_TRUNC('hour', dh.thoigianthanhtoan)
    ORDER BY hour ASC
  `;

  const res = await pool.query(query, [maSuatDien]);
  return buildChartSeries(res.rows, windowSize, isDaily ? "daily" : "hourly");
};

export const getOrdersForEventService = async ({
  maSuKien,
  page = 1,
  limit = 10,
  search,
}) => {
  const offset = (page - 1) * limit;

  const params = [maSuKien];
  const searchClause = search
    ? `AND (
        LOWER(dh.madonhang::text) LIKE $${params.length + 1}
        OR LOWER(nd.tennguoidung) LIKE $${params.length + 1}
        OR LOWER(nd.email) LIKE $${params.length + 1}
      )`
    : "";

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
  }

  const baseQuery = `
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    JOIN nguoi_dung nd ON nd.manguoidung = dh.manguoidung
    WHERE sd.masukien = $1
      AND dh.trangthai = 'DA_THANH_TOAN'
      ${searchClause}
  `;

  const dataRes = await pool.query(
    `
    SELECT 
      dh.madonhang,
      dh.trangthai,
      dh.tongtien,
      dh.ngaydatve,
      dh.thoigianthanhtoan,
      nd.tennguoidung,
      nd.email,
      SUM(ct.soluong) AS total_tickets
    ${baseQuery}
    GROUP BY 
      dh.madonhang, dh.trangthai, dh.tongtien, dh.ngaydatve, dh.thoigianthanhtoan,
      nd.tennguoidung, nd.email
    ORDER BY dh.thoigianthanhtoan DESC NULLS LAST, dh.ngaydatve DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `,
    [...params, limit, offset]
  );

  const countRes = await pool.query(
    `
    SELECT COUNT(DISTINCT dh.madonhang) AS total
    ${baseQuery}
  `,
    params
  );

  return {
    orders: dataRes.rows.map((row) => ({
      madonhang: row.madonhang,
      trangthai: row.trangthai,
      tongtien: toSafeNumber(row.tongtien),
      ngaydatve: row.ngaydatve,
      thoigianthanhtoan: row.thoigianthanhtoan,
      tennguoidung: row.tennguoidung,
      email: row.email,
      totalTickets: toSafeNumber(row.total_tickets),
    })),
    total: toSafeNumber(countRes.rows[0]?.total),
    page: page,
    limit: limit,
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
