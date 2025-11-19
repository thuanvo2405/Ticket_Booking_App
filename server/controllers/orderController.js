import handleResponse from "../utils/handleResponse.js";
import {
  createOrderService,
} from "../models/orderModel.js";

export const createOrder = async (req, res, next) => {
  try {
    const manguoidung = req.user.user.id;
    const { items } = req.body;
    if (!manguoidung) {
      const error = new Error("Vui lòng đăng nhập để tạo đơn hàng");
      error.statusCode = 401;
      throw error;
    }

    if (!items || items.length === 0) {
      const error = new Error("Thiếu dữ liệu bắt buộc");
      error.statusCode = 400;
      throw error;
    }

    const order = await createOrderService(manguoidung, items);

    handleResponse(res, 201, "Tạo đơn hàng thành công", order);
  } catch (error) {
    next(error);
  }
};
