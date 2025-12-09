import pool from "../config/db.js";
import {
  updateProfileUserService,
  toggleUserStatusService,
  getUsersService,
  updateForAdminService,
} from "../models/userModel.js";
import handleResponse from "../utils/handleResponse.js";
import { updateProfileSchema } from "../utils/validate.js";

export const getProfileUser = async (req, res, next) => {
  try {
    const userId = req.user.user.id;

    if (!req.user.user.id) {
      const error = new Error("Token không hợp lệ hoặc đã hết hạn");
      error.statusCode = 401;
      throw error;
    }

    const result = await pool.query(
      "SELECT tennguoidung,sodienthoai,anhdaidien,email FROM nguoi_dung WHERE maNguoiDung = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error("Người dùng không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    handleResponse(res, 200, "Lấy thông tin thành công", result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProfileUser = async (req, res, next) => {
  try {
    if (!req.user?.user?.id) {
      return res.status(400).json({ error: "Token không hợp lệ" });
    }

    const userId = req.user.user.id;

    const avatar = req.file?.path;

    const { tennguoidung, sodienthoai } = updateProfileSchema.parse(req.body);

    if (!tennguoidung && !sodienthoai && !avatar) {
      return res.status(400).json({ error: "Không có dữ liệu để cập nhật" });
    }
    const updatedUser = await updateProfileUserService(
      userId,
      tennguoidung,
      sodienthoai,
      avatar
    );
    handleResponse(res, 200, "Cập nhật thành công", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { manguoidung } = req.params;
    const currentUserId = req.user?.user?.id;

    if (currentUserId && String(currentUserId) === String(manguoidung)) {
      const err = new Error("Bạn không thể tự khóa tài khoản của chính mình");
      err.statusCode = 400;
      throw err;
    }

    const targetUser = await pool.query(
      `
      SELECT manguoidung, vaitro, is_active
      FROM nguoi_dung
      WHERE manguoidung = $1
    `,
      [manguoidung]
    );

    if (targetUser.rowCount === 0) {
      const err = new Error("Người dùng không tồn tại");
      err.statusCode = 404;
      throw err;
    }

    const { vaitro, is_active: isActive } = targetUser.rows[0];
    const newStatus = !isActive;

    if (vaitro === "QUAN_TRI" && !newStatus) {
      const activeAdminCountRes = await pool.query(
        "SELECT COUNT(*) AS total FROM nguoi_dung WHERE vaitro = 'QUAN_TRI' AND is_active = true"
      );
      const activeAdminCount = parseInt(activeAdminCountRes.rows[0].total, 10);

      if (activeAdminCount <= 1) {
        const err = new Error("Không thể khóa admin duy nhất còn lại");
        err.statusCode = 400;
        throw err;
      }
    }

    const status = await toggleUserStatusService(manguoidung);

    handleResponse(res, 200, "Cập nhật trạng thái thành công", {
      is_active: status,
    });
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
    let { page = 1, limit = 10, vaitro, search } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const { rows, total } = await getUsersService(
      limit,
      offset,
      vaitro,
      search
    );
    const totalPages = Math.ceil(total / limit);

    handleResponse(res, 200, "Lấy danh sách người dùng thành công", {
      data: rows,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
