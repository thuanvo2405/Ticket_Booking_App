import pool from "../config/db.js";
import {
  updateProfileUserService,
  deleteForAdminService,
  getUsersService,
  updateForAdminService,
} from "../models/userModel.js";
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

export const deleteForAdmin = async (req, res, next) => {
  try {
    const { manguoidung } = req.params;
    await deleteForAdminService(manguoidung);
    handleResponse(res, 200, "Xóa người dùng thành công");
  } catch (error) {
    next(error);
  }
};

export const updateForAdmin = async (req, res, next) => {
  try {
    const { manguoidung } = req.params;
    const { tennguoidung, email, chucvu } = req.body;
    const result = await updateForAdminService(
      manguoidung,
      tennguoidung,
      email,
      chucvu
    );
    handleResponse(res, 200, "Cập nhật thành công", result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const users = await getUsersService(limit, offset);

    const totalResult = await pool.query(
      `SELECT COUNT(*) AS total FROM nguoi_dung`
    );

    const total = totalResult.rows[0].total;
    handleResponse(res, 200, "Lấy danh sách người dùng thành công", {
      data: users.rows,
      total: parseInt(total),
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
