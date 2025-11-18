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

export const getPerformaneAPI = async (maSuKien: string) => {
  const res = await axios.get(URL + "performance", { params: { maSuKien } });
  return res.data.data.result;
};

export const deletePerformaneAPI = async (maSuatDien: string) => {
  const res = await axios.delete(URL + "performance", {
    params: { maSuatDien },
  });
  return res.data;
};

export const createTicketTypeAPI = async (
  tenLoaiVe: string,
  moTa: string,
  giaTien: number,
  soLuongPhatHanh: number,
  maSuatDien: string
) => {
  const res = await axiosInstance.post(URL + "ticket-type", {
    tenLoaiVe,
    moTa,
    giaTien,
    soLuongPhatHanh,
    maSuatDien,
  });

  return res.data.data;
};

export const getTicketTypeAPI = async (maSuatDien: string) => {
  const res = await axios.get(URL + "ticket-type", { params: { maSuatDien } });
  return res.data.data.result;
};

export const deleteTicketTypeAPI = async (maLoaiVe: string) => {
  const res = await axios.delete(URL + "ticket-type?maLoaiVe=" + maLoaiVe);
  return res.data.data;
};
