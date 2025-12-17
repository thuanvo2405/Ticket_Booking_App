import handleResponse from "../utils/handleResponse.js";
import {
  createPromotionService,
  getPromotionsService,
  deletePromotionService,
  updatePromotionService,
} from "../models/promotionModel.js";
import { PromotionSchema, UpdatePromotionSchema } from "../utils/validate.js";
import pool from "../config/db.js";

const getLastPerformanceStart = async (maSuKien) => {
  const res = await pool.query(
    "SELECT MAX(thoigianbatdau) AS last_start FROM suat_dien WHERE masukien = $1",
    [maSuKien]
  );
  return res.rows[0]?.last_start ? new Date(res.rows[0].last_start) : null;
};

const assertUniquePromotionCode = async (
  maGiamGia,
  maSuKien,
  excludeMaKhuyenMai = null
) => {
  const params = [maGiamGia, maSuKien];
  let query = `
    SELECT 1
    FROM khuyen_mai
    WHERE LOWER(magiamgia) = LOWER($1)
      AND masukien = $2
  `;

  if (excludeMaKhuyenMai) {
    query += " AND makhuyenmai <> $3";
    params.push(excludeMaKhuyenMai);
  }

  const res = await pool.query(query, params);

  if (res.rowCount > 0) {
    const err = new Error(
      "Mã giảm giá đã tồn tại trong sự kiện này, vui lòng chọn mã khác"
    );
    err.statusCode = 400;
    throw err;
  }
};

const assertPromotionDateRange = async (ngayBatDau, ngayKetThuc, maSuKien) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(ngayBatDau);
  const end = new Date(ngayKetThuc);

  if (start < today) {
    const err = new Error("Ngày bắt đầu khuyến mãi không được nhỏ hơn hôm nay");
    err.statusCode = 400;
    throw err;
  }

  const lastStart = await getLastPerformanceStart(maSuKien);
  if (!lastStart) {
    const err = new Error(
      "Sự kiện chưa có suất diễn, không thể tạo khuyến mãi"
    );
    err.statusCode = 400;
    throw err;
  }

  if (end >= lastStart) {
    const err = new Error(
      "Ngày kết thúc khuyến mãi phải trước suất diễn cuối cùng của sự kiện"
    );
    err.statusCode = 400;
    throw err;
  }
};

export const getPromotions = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    const promotions = await getPromotionsService(maSuKien);
    handleResponse(
      res,
      200,
      "Lấy danh sách mã giảm giá thành công",
      promotions
    );
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (req, res, next) => {
  try {
    const validateData = PromotionSchema.parse(req.body);

    await assertUniquePromotionCode(
      validateData.maGiamGia,
      validateData.maSuKien
    );

    await assertPromotionDateRange(
      validateData.ngayBatDau,
      validateData.ngayKetThuc,
      validateData.maSuKien
    );

    await createPromotionService(
      validateData.maGiamGia,
      validateData.giaTriGiam,
      validateData.loaiGiam,
      validateData.ngayBatDau,
      validateData.ngayKetThuc,
      validateData.soLuongPhatHanh,
      validateData.maSuKien,
      validateData.giaTriToiThieu
    );

    handleResponse(res, 201, "Tạo mã giảm giá thành công");
  } catch (error) {
    next(error);
  }
};

export const updatePromotion = async (req, res, next) => {
  try {
    const { maKhuyenMai } = req.params;
    const validateData = UpdatePromotionSchema.parse(req.body);

    const promoLookup = await pool.query(
      "SELECT masukien FROM khuyen_mai WHERE makhuyenmai = $1",
      [maKhuyenMai]
    );
    const maSuKien = promoLookup.rows[0]?.masukien;

    if (!maSuKien) {
      const err = new Error("Khuyến mãi không tồn tại");
      err.statusCode = 404;
      throw err;
    }

    await assertUniquePromotionCode(
      validateData.maGiamGia,
      maSuKien,
      maKhuyenMai
    );
    await assertPromotionDateRange(
      validateData.ngayBatDau,
      validateData.ngayKetThuc,
      maSuKien
    );

    await updatePromotionService(
      maKhuyenMai,
      validateData.maGiamGia,
      validateData.giaTriGiam,
      validateData.loaiGiam,
      validateData.ngayBatDau,
      validateData.ngayKetThuc,
      validateData.soLuongPhatHanh,
      validateData.giaTriToiThieu
    );

    handleResponse(res, 200, "Cập nhật khuyến mãi thành công");
  } catch (error) {
    next(error);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    const { maKhuyenMai } = req.query;
    if (!maKhuyenMai) throw new Error("Thiếu mã giảm giá để xóa");

    await deletePromotionService(maKhuyenMai);

    handleResponse(res, 200, "Xóa mã giảm giá thành công");
  } catch (error) {
    next(error);
  }
};
