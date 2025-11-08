import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const CreatePerformanceAPI = async (
  thoiGianBatDau: string,
  thoiGianKetThuc: string,
  maSuKien: string
) => {
  const res = await axiosInstance.post(URL + "performance", {
    thoiGianBatDau,
    thoiGianKetThuc,
    maSuKien: "9c13895f-daf4-4278-b691-5b49b070dbc1",
  });

  return res.data.data;
};
