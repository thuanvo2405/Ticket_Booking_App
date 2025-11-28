import handleResponse from "../utils/handleResponse.js";
import {
  createEventService,
  updateEventService,
  getEventByIdService,
  updateEventStatusService,
  getEventsService,
  isExist,
  getEventByOrganizerIdService,
  getEventTypesService,
  deleteEventService,
  getBankAccountService,
  createBankAccountService,
  updateBankAccountService,
  deleteBankAccountService,
  getEventsByCategoryService,
} from "../models/eventModel.js";
import { BankAccountSchema } from "../utils/validate.js";
import { getOrganizerID } from "../models/organizerModel.js";
import pool from "../config/db.js";
import { EventSchema } from "../utils/validate.js";
import { deleteFile } from "../utils/deleteImage.js";
export const createEvent = async (req, res, next) => {
  try {
    const userID = req.user.user.id;

    const { tenSuKien, moTa, diaChi, phuong, quan, thanhPho, maLoaiSuKien } =
      EventSchema.parse(req.body);

    const { anhSuKienNgang, anhSuKienDoc } = req.files || {};
    if (!Array.isArray(anhSuKienNgang) || anhSuKienNgang.length === 0)
      throw new Error("Ảnh sự kiện ngang là bắt buộc");
    if (!Array.isArray(anhSuKienDoc) || anhSuKienDoc.length === 0)
      throw new Error("Ảnh sự kiện dọc là bắt buộc");

    const diaChiAnhNgang = anhSuKienNgang[0].path;
    const diaChiAnhDoc = anhSuKienDoc[0].path;

    const { matochuc } = await getOrganizerID(userID);
    if (!matochuc)
      throw new Error("Không tìm thấy thông tin tổ chức của người dùng");

    const result = await createEventService(
      tenSuKien,
      moTa || null,
      diaChi,
      phuong,
      quan,
      thanhPho,
      matochuc,
      maLoaiSuKien,
      diaChiAnhNgang,
      diaChiAnhDoc
    );

    handleResponse(res, 201, "Tạo sự kiện thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const userID = req.user.user.id;
    const { maSuKien } = req.query;

    if (!maSuKien) throw new Error("Thiếu mã sự kiện để cập nhật");

    const oldEvent = await isExist(maSuKien);
    if (!oldEvent) throw new Error("Sự kiện không tồn tại");

    const { matochuc } = await getOrganizerID(userID);

    const newAnhNgang = req.files?.anhSuKienNgang?.[0];
    const newAnhDoc = req.files?.anhSuKienDoc?.[0];

    const pathAnhNgang = newAnhNgang?.path ?? null;
    const pathAnhDoc = newAnhDoc?.path ?? null;

    const result = await updateEventService(
      maSuKien,
      req.body.tenSuKien,
      req.body.moTa,
      req.body.diaChi,
      req.body.phuong,
      req.body.quan,
      req.body.thanhPho,
      matochuc,
      req.body.maLoaiSuKien,
      pathAnhNgang,
      pathAnhDoc
    );

    if (pathAnhDoc && oldEvent.anhsukiendoc) {
      deleteFile(oldEvent.anhsukiendoc);
    }

    if (pathAnhNgang && oldEvent.anhsukienngang) {
      deleteFile(oldEvent.anhsukienngang);
    }

    handleResponse(res, 200, "Cập nhật thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    const { trangThai } = req.body;

    if (!maSuKien) throw new Error("Thiếu mã sự kiện để cập nhật");

    const oldEvent = await isExist(maSuKien);
    if (!oldEvent) throw new Error("Sự kiện không tồn tại");

    const result = await updateEventStatusService(maSuKien, trangThai);

    handleResponse(res, 200, "Cập nhật sự kiện thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;

    const result = await getEventByIdService(maSuKien);
    if (!result) throw new Error("Sự kiện không tồn tại");

    handleResponse(res, 200, "Lấy dữ liệu sự kiện thành công", {
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { trangThai, from, to, khuVuc, tenLoaiSuKien, maToChuc, tenSuKien } =
      req.query;

    const role = req.user?.user?.role;

    const result = await getEventsService({
      page,
      limit,
      trangThai,
      from,
      to,
      khuVuc,
      tenLoaiSuKien,
      role,
      maToChuc,
      tenSuKien,
    });

    handleResponse(res, 200, "Lấy dữ liệu sự kiện thành công", { ...result });
  } catch (error) {
    next(error);
  }
};

export const getEventByOrganizerId = async (req, res, next) => {
  try {
    const userId = req.user.user.id;
    const { trangThai } = req.query;

    const orgQuery = await pool.query(
      "SELECT matochuc FROM to_chuc WHERE manguoidung = $1",
      [userId]
    );

    const { matochuc } = orgQuery.rows[0];

    const events = await getEventByOrganizerIdService(matochuc, trangThai);

    handleResponse(res, 200, "Lấy dữ liệu sự kiện thành công", events);
  } catch (error) {
    next(error);
  }
};

export const getEventTypes = async (req, res, next) => {
  try {
    const result = await getEventTypesService();
    handleResponse(res, 201, "Lấy loại sự kiện thành công", result);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;

    const oldEvent = await isExist(maSuKien);
    if (!oldEvent) throw new Error("Sự kiện không tồn tại");

    await deleteEventService(maSuKien);

    handleResponse(res, 200, "Xóa sự kiện thành công");
  } catch (error) {
    next(error);
  }
};

export const createBankAccount = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;

    const parsed = BankAccountSchema.parse({
      ...req.body,
      maSuKien,
    });

    const result = await createBankAccountService(
      parsed.maSuKien,
      parsed.tenNganHang,
      parsed.chiNhanh,
      parsed.soTaiKhoan,
      parsed.tenChuSoHuu
    );

    handleResponse(res, 201, "Tạo tài khoản ngân hàng thành công", result);
  } catch (error) {
    next(error);
  }
};

export const getBankAccount = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;

    const result = await getBankAccountService(maSuKien);
    handleResponse(
      res,
      200,
      "Lấy thông tin tài khoản ngân hàng thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const updateBankAccount = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    if (!maSuKien) return res.status(400).json({ error: "EventId bắt buộc" });

    const parsed = BankAccountSchema.partial().parse({ ...req.body });

    const fields = {
      tenNganHang: parsed.tenNganHang,
      chiNhanh: parsed.chiNhanh,
      soTaiKhoan: parsed.soTaiKhoan,
      chuTaiKhoan: parsed.tenChuSoHuu,
    };

    const result = await updateBankAccountService(maSuKien, fields);

    handleResponse(res, 200, "Cập nhật tài khoản ngân hàng thành công", result);
  } catch (error) {
    next(error);
  }
};

export const deleteBankAccount = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    await deleteBankAccountService(maSuKien);
    handleResponse(res, 200, "Xóa tài khoản ngân hàng thành công");
  } catch (error) {
    next(error);
  }
};

export const getEventsByCategory = async (req, res, next) => {
  try {
    const data = await getEventsByCategoryService();

    handleResponse(res, 200, "Lấy sự kiện theo danh mục thành công", data);
  } catch (error) {
    next(error);
  }
};
