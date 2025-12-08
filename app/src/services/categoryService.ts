import axiosInstance from "./axiosInstance";

export type EventCategory = {
  maloaisukien: string;
  tenloaisukien: string;
};

export const getAdminCategoriesAPI = async () => {
  const res = await axiosInstance.get("event-categories");
  return res.data.data;
};

export const createAdminCategoryAPI = async (tenloaisukien: string) => {
  const res = await axiosInstance.post("event-categories", { tenloaisukien });
  return res.data.data;
};

export const updateAdminCategoryAPI = async (
  id: string,
  tenloaisukien: string
) => {
  const res = await axiosInstance.patch(`event-categories/${id}`, {
    tenloaisukien,
  });
  return res.data.data;
};

export const deleteAdminCategoryAPI = async (id: string) => {
  await axiosInstance.delete(`event-categories/${id}`);
};
