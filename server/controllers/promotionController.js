import handleResponse from "../utils/handleResponse.js";
import {
  createPromotionService,
  getPromotionsService,
  deletePromotionService,
  updatePromotionService,
} from "../models/promotionModel.js";
import { PromotionSchema, UpdatePromotionSchema } from "../utils/validate.js";

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
