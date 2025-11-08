import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";
import axios from "axios";

export const CreatePerformanceAPI = async (
  thoiGianBatDau: string,
  thoiGianKetThuc: string,
  maSuKien: string
) => {
  const res = await axiosInstance.post(URL + "performance", {
    thoiGianBatDau,
    thoiGianKetThuc,
    maSuKien,
  });

  return res.data.data;
};

export const getPerformaneAPI = async (maSuKien: number) => {
  const res = await axios.get(URL + "performance", { params: { maSuKien } });
  return res.data.data.result;
};

export const deletePerformaneAPI = async (maSuatDien: number) => {
  const res = await axios.delete(URL + "performance", {
    params: { maSuatDien },
  });
  return res.data;
};
