import pool from "../config/db.js";
import { updateProfileUserService } from "../models/userModel.js";
import handleResponse from "../utils/handleResponse.js";

export const getProfileUser = async (req, res, next) => {
  try {
    const userId = req.user.user.id;
    const result = await pool.query(
      "SELECT tennguoidung,sodienthoai,anhdaidien FROM nguoi_dung WHERE maNguoiDung = $1",
      [userId]
    );
    handleResponse(res, 200, "Lấy thông tin thành công", result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProfileUser = async (req, res, next) => {
  try {
    const userId = req.user.user.id;

    const avatar = req.file ? req.file.path : null;

    const { tennguoidung, sodienthoai } = req.body;

    await updateProfileUserService(userId, tennguoidung, sodienthoai, avatar);

    handleResponse(res, 200, "Cập nhật thành công");
  } catch (err) {
    next(err);
  }
};
