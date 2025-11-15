import pool from "../config/db.js";

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

export const logInService = async (email) => {
  const result = await pool.query("SELECT * FROM nguoi_dung WHERE email = $1", [
    email,
  ]);
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

  const result = await pool.query(query, values);
  return result.rows[0];
};
