import pool from "../config/db.js";

export const createOrganizerProfileService = async ({
  maNguoiDung,
  moTa,
  tenToChuc,
  diaChiAnh,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertResult = await client.query(
      "INSERT INTO to_chuc (tenToChuc, anhToChuc, moTa, maNguoiDung) VALUES ($1, $2, $3, $4) RETURNING *",
      [tenToChuc, diaChiAnh, moTa, maNguoiDung]
    );

    await client.query(
      "UPDATE nguoi_dung SET vaiTro = 'TO_CHUC' WHERE maNguoiDung = $1",
      [maNguoiDung]
    );

    await client.query("COMMIT");

    return insertResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getOrganizerProfileService = async (maNguoiDung) => {
  const result = await pool.query(
    "SELECT tenToChuc,anhToChuc,moTa FROM to_chuc WHERE maNguoiDung = $1",
    [maNguoiDung]
  );

  return result.rows[0];
};
