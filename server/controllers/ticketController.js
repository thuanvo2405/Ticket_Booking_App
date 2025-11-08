import handleResponse from "../utils/handleResponse.js";
import {
  createTicketTypeService,
  createPerformanceService,
  getPerformaneService,
  deletePerformanceService,
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
    const result = await deletePerformanceService(maSuatDien);
    handleResponse(res, 201, "Xóa thông tin suất diễn thành công");
  } catch (error) {
    next(error);
  }
};
