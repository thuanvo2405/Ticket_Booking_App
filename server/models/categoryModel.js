import pool from "../config/db.js";

export const getAllCategoriesService = async () => {
  const result = await pool.query(
    "SELECT maloaisukien, tenloaisukien FROM loai_su_kien ORDER BY tenloaisukien ASC"
  );
  return result.rows;
};

export const createCategoryService = async (tenloaisukien) => {
  const countRes = await pool.query("SELECT COUNT(*) FROM loai_su_kien");
  const total = Number(countRes.rows[0].count);
  if (total >= 10) {
    const error = new Error(
      "Chỉ có thể tạo tối đa 10 loại sự kiện, vui lòng xóa bớt một loại sự kiện"
    );
    error.statusCode = 400;
    throw error;
  }

  const existRes = await pool.query(
    "SELECT 1 FROM loai_su_kien WHERE LOWER(tenloaisukien) = LOWER($1)",
    [tenloaisukien]
  );

  if (existRes.rowCount > 0) {
    const error = new Error("Tên loại sự kiện đã tồn tại");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    "INSERT INTO loai_su_kien (tenloaisukien) VALUES ($1) RETURNING maloaisukien, tenloaisukien",
    [tenloaisukien]
  );

  return result.rows[0];
};

export const updateCategoryService = async (id, tenloaisukien) => {
  const existRes = await pool.query(
    "SELECT 1 FROM loai_su_kien WHERE LOWER(tenloaisukien) = LOWER($1)",
    [tenloaisukien]
  );

  if (existRes.rowCount > 0) {
    const error = new Error("Tên loại sự kiện đã tồn tại");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    "UPDATE loai_su_kien SET tenloaisukien = $2 WHERE maloaisukien = $1 RETURNING maloaisukien, tenloaisukien",
    [id, tenloaisukien]
  );
  return result.rows[0];
};

export const deleteCategoryService = async (id) => {
  const eventUsingCategory = await pool.query(
    "SELECT COUNT(*) FROM su_kien WHERE maloaisukien = $1",
    [id]
  );

  if (Number(eventUsingCategory.rows[0].count) > 0) {
    const error = new Error(
      "Không thể xóa loại sự kiện đang được sử dụng bởi các sự kiện hiện có"
    );
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    "DELETE FROM loai_su_kien WHERE maloaisukien = $1 RETURNING maloaisukien",
    [id]
  );
  return result.rows[0];
};
