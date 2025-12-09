import handleResponse from "../utils/handleResponse.js";
import {
  createOrganizerProfileService,
  getOrganizerProfileService,
  updateOrganizerProfileService,
} from "../models/organizerModel.js";
import { jwtTokens } from "../utils/jwtHelper.js";

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

    const updatedUser = {
      manguoidung: userID,
      vaitro: "TO_CHUC",
    };

    const tokens = jwtTokens(updatedUser);

    handleResponse(res, 201, "Tạo hồ sơ tổ chức thành công", {
      profile: newProfile,
      user: updatedUser,
      tokens,
    });
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

export const updateOrganizerProfile = async (req, res, next) => {
  try {
    const userId = req.user.user.id;

    const anhtochuc = req.file ? req.file.path : null;

    const { tentochuc, mota } = req.body;

    await updateOrganizerProfileService(userId, tentochuc, mota, anhtochuc);

    handleResponse(res, 200, "Cập nhật thành công");
  } catch (err) {
    next(err);
  }
};
