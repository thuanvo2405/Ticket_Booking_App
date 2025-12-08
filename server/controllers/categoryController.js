import handleResponse from "../utils/handleResponse.js";
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../models/categoryModel.js";
import { CategorySchema } from "../utils/validate.js";

export const getCategories = async (req, res, next) => {
  try {
    const data = await getAllCategoriesService();
    handleResponse(res, 200, "Lấy danh sách loại sự kiện thành công", data);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { tenloaisukien } = CategorySchema.parse(req.body);
    const created = await createCategoryService(tenloaisukien);
    handleResponse(res, 201, "Tạo loại sự kiện thành công", created);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenloaisukien } = CategorySchema.parse(req.body);

    const updated = await updateCategoryService(id, tenloaisukien);
    if (!updated) return handleResponse(res, 404, "Loại sự kiện không tồn tại");
    handleResponse(res, 200, "Cập nhật loại sự kiện thành công", updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCategoryService(id);
    if (!deleted) return handleResponse(res, 404, "Loại sự kiện không tồn tại");
    handleResponse(res, 200, "Xóa loại sự kiện thành công");
  } catch (err) {
    next(err);
  }
};
