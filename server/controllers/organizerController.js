import handleResponse from "../utils/handleResponse.js";
import {
  createOrganizerProfileService,
  getOrganizerProfileService,
} from "../models/organizerModel.js";

export const createOrganizerProfile = async (req, res, next) => {
  try {
    const file = req.file;
    const userID = req.user.user.id;
    const { moTa, tenToChuc } = req.body;

    if (!file) {
      return handleResponse(res, 400, "Bạn bị thiếu ảnh tổ chức");
    }

    const existed = await getOrganizerProfileService(userID);
    if (existed) {
      return handleResponse(res, 400, "Bạn đã tạo hồ sơ tổ chức cho mình");
    }

    const newProfile = await createOrganizerProfileService({
      maNguoiDung: userID,
      moTa,
      tenToChuc,
      diaChiAnh: file.path,
    });

    handleResponse(res, 201, "Tạo hồ sơ tổ chức thành công", newProfile);
  } catch (error) {
    next(error);
  }
};

export const getOrganizerProfile = async (req, res, next) => {
  try {
    const userID = req.user.user.id;

    const result = await getOrganizerProfileService(userID);
    if (!result) {
      return handleResponse(res, 404, "Organizer profile not found");
    }

    handleResponse(res, 200, "Get profile successful", result);
  } catch (error) {
    next(error);
  }
};
