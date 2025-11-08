import handleResponse from "../utils/handleResponse.js";
import { createPromotionService } from "../models/promotionModel.js";

export const createPromotion = async (req, res, next) => {
  try {
    const {
      maGiamGia,
      giaTriGiam,
      loaiGiam,
      ngayBatDau,
      ngayKetThuc,
      soLuongPhatHanh,
      maSuKien,
    } = req.body;
    await createPromotionService(
      maGiamGia,
      giaTriGiam,
      loaiGiam,
      ngayBatDau,
      ngayKetThuc,
      soLuongPhatHanh,
      maSuKien
    );
    handleResponse(res, 201, "Tạo mã giảm giá thành công");
  } catch (error) {
    next(error);
  }
};
