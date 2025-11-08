import handleResponse from "../utils/handleResponse.js";
import { createEventService } from "../models/eventModel.js";
export const createEvent = async (req, res, next) => {
  try {
    const {
      tenSuKien,
      moTa,
      diaChi,
      phuong,
      quan,
      thanhPho,
      maToChuc,
      maLoaiSuKien,
    } = req.body;
    const { anhSuKienNgang, anhSuKienDoc } = req.files;
    const diaChiAnhNgang = anhSuKienNgang[0].path;
    const diaChiAnhDoc = anhSuKienDoc[0].path;
    if (
      !tenSuKien ||
      !diaChi ||
      !phuong ||
      !quan ||
      !thanhPho ||
      !anhSuKienDoc ||
      !anhSuKienNgang
    )
      throw new Error("Vui lòng nhập đầy đủ trường");
    await createEventService(
      tenSuKien,
      moTa,
      diaChi,
      phuong,
      quan,
      thanhPho,
      maToChuc,
      maLoaiSuKien,
      diaChiAnhNgang,
      diaChiAnhDoc
    );

    handleResponse(res, 201, "Tạo sự kiện thành công");
  } catch (error) {
    next(error);
  }
};
