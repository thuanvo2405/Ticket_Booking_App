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
    SELECT DATE(ngaydatve) AS date, SUM(tongtien) AS revenue
    FROM don_hang
    WHERE ngaydatve >= $1 
      AND ngaydatve < $2::date + INTERVAL '1 day'
      AND trangthai = 'DA_THANH_TOAN'
    GROUP BY DATE(ngaydatve)
    ORDER BY DATE(ngaydatve);
  `,
    [from, to]
  );

  return result.rows;
};
