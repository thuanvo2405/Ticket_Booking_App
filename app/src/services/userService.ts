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
