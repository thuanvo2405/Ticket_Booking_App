import pool from "../config/db.js";
import { deleteFile } from "../utils/deleteImage.js";
export const signUpService = async (username, email, hashedPassword) => {
  const checkUser = await pool.query(
    "SELECT * FROM nguoi_dung WHERE email = $1",
    [email]
  );

  if (checkUser.rows.length > 0) {
    const error = new Error("Email này đã tồn tại");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO nguoi_dung (tennguoidung, email, matkhau) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const signUpForAdminService = async (
  username,
  email,
  hashedPassword
) => {
  const checkUser = await pool.query(
    "SELECT * FROM nguoi_dung WHERE email = $1",
    [email]
  );

  if (checkUser.rows.length > 0) {
    const error = new Error("Email này đã tồn tại");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO nguoi_dung (tennguoidung, email, matkhau,vaitro,isverified) 
     VALUES ($1, $2, $3,'QUAN_TRI',true) 
     RETURNING *`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const logInService = async (email) => {
  const result = await pool.query("SELECT * FROM nguoi_dung WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const logInServiceForAdmin = async (email) => {
  const result = await pool.query(
    "SELECT * FROM nguoi_dung WHERE email = $1 and vaitro = 'QUAN_TRI'",
    [email]
  );
  return result.rows[0];
};

export const updateProfileUserService = async (
  userId,
  tennguoidung,
  sodienthoai,
  avatar
) => {
  let fields = [];
  let values = [];
  let index = 1;

  const userRes = await pool.query(
    "SELECT anhdaidien, is_active FROM nguoi_dung WHERE manguoidung = $1",
    [userId]
  );

  if (userRes.rows.length === 0) {
    const err = new Error("Người dùng không tồn tại");
    err.statusCode = 404;
    throw err;
  }

  const oldAvatar = userRes.rows[0].anhdaidien;

  if (!userRes.rows[0].is_active) {
    const err = new Error("Tài khoản bị khóa, không thể cập nhật thông tin");
    err.statusCode = 403;
    throw err;
  }

  if (tennguoidung) {
    fields.push(`tennguoidung = $${index++}`);
    values.push(tennguoidung);
  }

  if (sodienthoai) {
    fields.push(`sodienthoai = $${index++}`);
    values.push(sodienthoai);
  }

  if (avatar) {
    fields.push(`anhdaidien  = $${index++}`);
    values.push(avatar);
  }

  if (fields.length === 0) {
    throw new Error("Không có dữ liệu để cập nhật");
  }

  values.push(userId);
  const query = `
    UPDATE nguoi_dung
    SET ${fields.join(", ")}
    WHERE manguoidung = $${index}
    RETURNING *;
  `;

  if (avatar && oldAvatar && oldAvatar !== avatar) {
    deleteFile(oldAvatar);
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const toggleUserStatusService = async (manguoidung) => {
  const result = await pool.query(
    "SELECT is_active, isverified FROM nguoi_dung WHERE manguoidung = $1",
    [manguoidung]
  );

  if (result.rowCount === 0) {
    throw new Error("Người dùng không tồn tại");
  }

  if (!result.rows[0].isverified) {
    const err = new Error("Người dùng chưa xác thực, không thể khóa");
    err.statusCode = 400;
    throw err;
  }

  const current = result.rows[0].is_active;
  const newStatus = !current;

  await pool.query(
    "UPDATE nguoi_dung SET is_active = $1 WHERE manguoidung = $2",
    [newStatus, manguoidung]
  );

  return newStatus;
};

export const getUsersService = async (limit, offset) => {
  const result = await pool.query(
    `SELECT manguoidung, tennguoidung, email, vaitro, anhdaidien, ngaytao, is_active, isverified
       FROM nguoi_dung
       ORDER BY ngaytao DESC
       LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result;
};

export const updateForAdminService = async (
  manguoidung,
  tennguoidung,
  email,
  chucvu
) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (tennguoidung !== undefined) {
    fields.push(`tennguoidung = $${idx++}`);
    values.push(tennguoidung);
  }
  if (email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }
  if (chucvu !== undefined) {
    fields.push(`vaitro = $${idx++}`);
    values.push(chucvu);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(manguoidung);
  const query = `
    UPDATE nguoi_dung
    SET ${fields.join(", ")}
    WHERE manguoidung = $${idx}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};
