import handleResponse from "../utils/handleResponse.js";
import {
  createTicketTypeService,
  createPerformanceService,
  getPerformaneService,
  deletePerformanceService,
  getTicketTypeService,
  deleteTicketTypeService,
  ticketTypeByPerformanceIDService,
  updatePerformanceService,
  updateTicketTypeService,
} from "../models/ticketModel.js";
import {
  TicketTypeSchema,
  PerformanceSchema,
  UpdatePerformanceSchema,
  UpdateTicketTypeSchema,
} from "../utils/validate.js";
import pool from "../config/db.js";
import { isEventNhap } from "../models/eventModel.js";

export const createTicketType = async (req, res, next) => {
  try {
    const data = TicketTypeSchema.parse({
      ...req.body,
      giaTien: Number(req.body.giaTien),
      soLuongPhatHanh: Number(req.body.soLuongPhatHanh),
    });

    const result = await createTicketTypeService(
      data.tenLoaiVe,
      data.moTa || null,
      data.giaTien,
      data.soLuongPhatHanh,
      data.maSuatDien,
    );

    handleResponse(res, 201, "Tạo loại vé thành công", result);
  } catch (error) {
    next(error);
  }
};

export const createPerformance = async (req, res, next) => {
  try {
    const data = PerformanceSchema.parse(req.body);

    const result = await createPerformanceService(
      data.thoiGianBatDau,
      data.thoiGianKetThuc,
      data.maSuKien,
    );

    handleResponse(res, 201, "Tạo suất diễn thành công", result);
  } catch (error) {
    next(error);
  }
};

export const getPerformane = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    const result = await getPerformaneService(maSuKien);
    handleResponse(res, 200, "Lấy thông tin suất diễn thành công", { result });
  } catch (error) {
    next(error);
  }
};

export const deletePerformance = async (req, res, next) => {
  try {
    const { maSuatDien } = req.query;
    const { rows } = await pool.query(
      `
      SELECT sd.masukien
      FROM suat_dien sd
      WHERE sd.masuatdien = $1
      `,
      [maSuatDien],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy suất diễn hoặc sự kiện",
      });
    }

    const masukien = rows[0].masukien;

    if (!(await isEventNhap(masukien))) {
      const err = new Error("Chỉ có thể xóa sự kiện ở trạng thái nháp");
      err.statusCode = 400;
      throw err;
    }

    await deletePerformanceService(maSuatDien);

    handleResponse(res, 201, "Xóa thông tin suất diễn thành công");
  } catch (error) {
    next(error);
  }
};

export const getTicketType = async (req, res, next) => {
  try {
    const { maSuatDien } = req.query;
    const result = await getTicketTypeService(maSuatDien);
    handleResponse(res, 200, "Lấy thông tin loại vé diễn thành công", {
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicketType = async (req, res, next) => {
  try {
    const { maLoaiVe } = req.query;

    const { rows } = await pool.query(
      `
      SELECT sd.masukien
      FROM loai_ve lv
      JOIN suat_dien sd ON lv.masuatdien = sd.masuatdien
      WHERE lv.maloaive = $1
      `,
      [maLoaiVe],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy loại vé hoặc suất diễn",
      });
    }

    const masukien = rows[0].masukien;

    if (!(await isEventNhap(masukien))) {
      const err = new Error("Chỉ có thể xóa sự kiện ở trạng thái nháp");
      err.statusCode = 400;
      throw err;
    }
    await deleteTicketTypeService(maLoaiVe);
    handleResponse(res, 201, "Xóa thông tin loại vé thành công");
  } catch (error) {
    next(error);
  }
};

export const ticketTypeByPerformanceID = async (req, res, next) => {
  try {
    const { maSuatDien } = req.params;
    const result = await ticketTypeByPerformanceIDService(maSuatDien);
    handleResponse(res, 200, "Lấy thông tin loại vé thành công", result);
  } catch (error) {
    next(error);
  }
};

export const updateTicketType = async (req, res, next) => {
  try {
    const data = UpdateTicketTypeSchema.parse({
      ...req.body,
      giaTien: Number(req.body.giaTien),
      soLuongPhatHanh: Number(req.body.soLuongPhatHanh),
    });

    const result = await updateTicketTypeService(
      data.tenLoaiVe,
      data.moTa || null,
      data.giaTien,
      data.soLuongPhatHanh,
      data.maLoaiVe,
    );

    handleResponse(res, 200, "Cập nhật loại vé thành công", result);
  } catch (error) {
    next(error);
  }
};

export const updatePerformance = async (req, res, next) => {
  try {
    const data = UpdatePerformanceSchema.parse(req.body);
    const result = await updatePerformanceService(
      data.thoiGianBatDau,
      data.thoiGianKetThuc,
      data.maSuatDien,
    );

    handleResponse(res, 200, "Cập nhật suất diễn thành công", result);
  } catch (error) {
    next(error);
  }
};
