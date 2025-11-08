import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const createEventAPI = async (
  tenSuKien: string,
  anhSuKienNgang: File,
  anhSuKienDoc: File,
  moTa: string,
  diaChi: string,
  phuong: string,
  quan: string,
  thanhPho: string
) => {
  const formData = new FormData();
  formData.append("tenSuKien", tenSuKien);
  formData.append("anhSuKienNgang", anhSuKienNgang);
  formData.append("anhSuKienDoc", anhSuKienDoc);
  formData.append("moTa", moTa);
  formData.append("diaChi", diaChi);
  formData.append("phuong", phuong);
  formData.append("quan", quan);
  formData.append("thanhPho", thanhPho);
  formData.append("maToChuc", "b1c52b15-1fae-430b-afcf-c34a43c3d4e1");
  formData.append("maLoaiSuKien", "4596a40f-b4b0-45d4-88f4-29b638d11e4f");

  const res = await axiosInstance.post(URL + "event", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};
