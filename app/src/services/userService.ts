import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const updateProfileUserAPI = async (
  tennguoidung?: string,
  sodienthoai?: number,
  anhdaidien?: File
) => {
  const formData = new FormData();
  if (tennguoidung) {
    formData.append("tennguoidung", tennguoidung);
  }
  if (anhdaidien) {
    formData.append("anhdaidien", anhdaidien);
  }
  if (sodienthoai) {
    formData.append("sodienthoai", sodienthoai.toString());
  }

  const res = await axiosInstance.patch(URL + "profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const getProfileUserAPI = async () => {
  const res = await axiosInstance.get(`profile`);
  return res.data.data;
};

export const getUsersAPI = async (
  page = 1,
  limit = 10,
  vaitro?: "QUAN_TRI" | "TO_CHUC" | "KHACH_HANG",
  search?: string
) => {
  const res = await axiosInstance.get(`users`, {
    params: { page, limit, vaitro, search },
  });
  return res.data.data;
};

export const toggleUserStatusAPI = async (manguoidung: string) => {
  const res = await axiosInstance.patch(`toggle-status/${manguoidung}`);
  return res.data.data;
};

export const createUserAPI = async ({
  tennguoidung,
  matkhau,
  email,
}: {
  tennguoidung: string;
  matkhau: string;
  email: string;
}) => {
  const res = await axiosInstance.post("signup-admin", {
    tennguoidung,
    matkhau,
    email,
  });
  return res.data.data;
};

interface UpdateUserData {
  tennguoidung?: string;
  email?: string;
  chucvu?: "QUAN_TRI" | "TO_CHUC" | "KHACH_HANG";
}

export const updateUserAPI = async (
  manguoidung: string,
  data: UpdateUserData
) => {
  const res = await axiosInstance.patch(`user-admin/${manguoidung}`, data);
  return res.data;
};
