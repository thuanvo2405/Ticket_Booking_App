import handleResponse from "../utils/handleResponse.js";
import {
  createTicketTypeService,
  createPerformanceService,
} from "../models/ticketModel.js";

export const createTicketType = async (req, res, next) => {
  try {
    const { tenLoaiVe, moTa, giaTien, soLuongPhatHanh, maSuKien } = req.body;
    await createTicketTypeService(
      tenLoaiVe,
      moTa,
      giaTien,
      soLuongPhatHanh,
      maSuKien
    );
    handleResponse(res, 201, "Tạo loại vé thành công");
  } catch (error) {
    next(error);
  }
};

export const createPerformance = async (req, res, next) => {
  try {
    const { thoiGianBatDau, thoiGianKetThuc, maSuKien } = req.body;
    await createPerformanceService(thoiGianBatDau, thoiGianKetThuc, maSuKien);
    handleResponse(res, 201, "Tạo suất diễn thành công");
  } catch (error) {
    next(error);
  }
};
