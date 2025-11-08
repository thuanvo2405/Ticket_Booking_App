import handleResponse from "../utils/handleResponse.js";
import { createPaymentService } from "../models/paymentController.js";

export const createPayment = async (req, res, next) => {
  try {
    handleResponse(res, 201, "Tạo hồ sơ tổ chức thành công");
  } catch (error) {
    next(error);
  }
};
