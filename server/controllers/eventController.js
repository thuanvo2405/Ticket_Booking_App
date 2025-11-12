import handleResponse from "../utils/handleResponse.js";
import {
  createEventService,
  updateEventService,
  getEventByIdService,
  updateEventStatusService,
  getEventsService,
} from "../models/eventModel.js";

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
    const result = await createEventService(
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
    console.log(result);

    handleResponse(res, 201, "Tạo sự kiện thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
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

    if (!maSuKien) throw new Error("Thiếu mã sự kiện để cập nhật");

    const oldEvent = await getEventByIdService(maSuKien);
    if (!oldEvent) throw new Error("Sự kiện không tồn tại");

    const diaChiAnhNgang = req.files?.anhSuKienNgang?.[0]?.path || undefined;
    const diaChiAnhDoc = req.files?.anhSuKienDoc?.[0]?.path || undefined;

    const result = await updateEventService(
      maSuKien,
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

    handleResponse(res, 200, "Cập nhật sự kiện thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;
    const { trangThai } = req.body;

    if (!maSuKien) throw new Error("Thiếu mã sự kiện để cập nhật");

    const oldEvent = await getEventByIdService(maSuKien);
    if (!oldEvent) throw new Error("Sự kiện không tồn tại");

    const result = await updateEventStatusService(maSuKien, trangThai);

    handleResponse(res, 200, "Cập nhật sự kiện thành công", {
      maSuKien: result.masukien,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { maSuKien } = req.query;

    const result = await getEventByIdService(maSuKien);
    if (!result) throw new Error("Sự kiện không tồn tại");

    handleResponse(res, 200, "Lấy dữ liệu sự kiện thành công", {
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { trangThai, from, to, viTri, maLoaiSuKien, maToChuc, tenSuKien } =
      req.query;

    const role = req.user?.user?.role;

    const result = await getEventsService({
      page,
      limit,
      trangThai,
      from,
      to,
      viTri,
      maLoaiSuKien,
      role,
      maToChuc,
      tenSuKien,
    });

    handleResponse(res, 200, "Lấy dữ liệu sự kiện thành công", { ...result });
  } catch (error) {
    next(error);
  }
};
