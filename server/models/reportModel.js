import pool from "../config/db.js";

export const getTotalUserService = async () => {
  const result = await pool.query("Select Count(*) from nguoi_dung");
  return result.rows;
};

export const getActiveEventsService = async () => {
  const result = await pool.query(
    "Select Count(*) from su_kien where trangthai = 'DA_DUYET'"
  );
  return result.rows;
};

export const getPendingEventsService = async () => {
  const result = await pool.query(
    "Select Count(*) from su_kien where trangthai = 'CHO_DUYET'"
  );
  return result.rows;
};

export const getRevenueTodayService = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(tongtien), 0) AS revenue
    FROM don_hang
    WHERE DATE(ngaydatve) = CURRENT_DATE and trangthai = 'DA_THANH_TOAN'
  `);

  return result.rows[0];
};

export const getRevenueServive = async (from, to) => {
  const result = await pool.query(
    `
    SELECT 
      d.date,
      COALESCE(SUM(dh.tongtien), 0) AS revenue
    FROM generate_series(
      $1::date,
      $2::date,
      INTERVAL '1 day'
    ) AS d(date)
    LEFT JOIN don_hang dh
      ON DATE(dh.ngaydatve) = d.date
      AND dh.trangthai = 'DA_THANH_TOAN'
    GROUP BY d.date
    ORDER BY d.date;
    `,
    [from, to]
  );

  return result.rows;
};

export const getTotalTicketForAdminService = async (maToChuc) => {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS total_ticket
    FROM ve v
    JOIN don_hang dh ON dh.madonhang = v.madonhang
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    JOIN su_kien sk ON sk.masukien = sd.masukien
    WHERE sk.matochuc = $1
    `,
    [maToChuc]
  );

  return Number(result.rows[0].total_ticket);
};

export const getTotalOrderForAdminService = async (maToChuc) => {
  const result = await pool.query(
    `
    SELECT COUNT(DISTINCT dh.madonhang) AS total_order
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    JOIN su_kien sk ON sk.masukien = sd.masukien
    WHERE sk.matochuc = $1
      AND dh.trangthai = 'DA_THANH_TOAN'
    `,
    [maToChuc]
  );

  return Number(result.rows[0].total_order);
};

export const getTotalRevenueForAdminService = async (maToChuc) => {
  const result = await pool.query(
    `
    SELECT COALESCE(SUM(dh.tongtien), 0) AS total_revenue
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    JOIN su_kien sk ON sk.masukien = sd.masukien
    WHERE sk.matochuc = $1
      AND dh.trangthai = 'DA_THANH_TOAN'
    `,
    [maToChuc]
  );

  return Number(result.rows[0].total_revenue);
};

export const getTotalEventForAdminService = async (maToChuc) => {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS total_event
    FROM su_kien
    WHERE matochuc = $1
    `,
    [maToChuc]
  );
  return Number(result.rows[0].total_event);
};

export const getRevenueByDateRangeService = async (
  maToChuc,
  fromDate,
  toDate
) => {
  const query = `
    SELECT 
        d.date::date AS date,
        COALESCE(
          SUM(
            CASE WHEN sk.matochuc IS NOT NULL THEN dh.tongtien ELSE 0 END
          ),
          0
        ) AS revenue
    FROM generate_series($2::date, $3::date, INTERVAL '1 day') AS d(date)
    LEFT JOIN don_hang dh
      ON DATE(dh.thoigianthanhtoan) = d.date
      AND dh.trangthai = 'DA_THANH_TOAN'
    LEFT JOIN chi_tiet_don_hang ct ON ct.madonhang = dh.madonhang
    LEFT JOIN loai_ve lv ON lv.maloaive = ct.maloaive
    LEFT JOIN suat_dien sd ON sd.masuatdien = lv.masuatdien
    LEFT JOIN su_kien sk ON sk.masukien = sd.masukien AND sk.matochuc = $1
    GROUP BY d.date
    ORDER BY d.date;
  `;

  const result = await pool.query(query, [maToChuc, fromDate, toDate]);

  return result.rows;
};
