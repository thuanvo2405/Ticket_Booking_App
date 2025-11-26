import handleResponse from "../utils/handleResponse.js";
import {
  createOrderService,
  getOrderDetailService,
  getOrderDetailByIdService,
  getOrdersByUserIdService,
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

export const getOrderById = async (req, res, next) => {
  try {
    const { madonhang } = req.params;

    const data = await getOrderDetailByIdService(madonhang);

    handleResponse(res, 200, "Lấy chi tiết đơn hàng thành công", data);
  } catch (err) {
    next(err);
  }
};

export const getOrdersByUserId = async (req, res, next) => {
  try {
    const userID = req.user.user.id;
    const data = await getOrdersByUserIdService(userID);
    console.log(data);
    handleResponse(res, 200, "Lấy tổng đơn hàng theo id người dùng", data);
  } catch (err) {
    next(err);
  }
};

export const getOrderDetail = async (req, res, next) => {
  try {
    const { madonhang } = req.params;
    console.log(madonhang);

    const data = await getOrderDetailService(madonhang);

    handleResponse(res, 200, "Lấy chi tiết đơn hàng thành công", data);
  } catch (err) {
    next(err);
  }
};
