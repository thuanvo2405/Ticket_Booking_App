import handleResponse from "../utils/handleResponse.js";
import { createPromotionService } from "../models/promotionModel.js";
import { PromotionSchema } from "../utils/validate.js";

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
