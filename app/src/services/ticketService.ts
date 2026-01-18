import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";
import axios from "axios";

export const CreatePerformanceAPI = async (
  thoiGianBatDau: string,
  thoiGianKetThuc: string,
  maSuKien: string,
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
  maSuatDien: string,
) => {
  console.log(moTa);
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
  return res.data.data.result.map((ticket: any) => ({
    ...ticket,
    giatien: Number(ticket.giatien),
    soluongphathanh: Number(ticket.soluongphathanh),
  }));
};

export const deleteTicketTypeAPI = async (maLoaiVe: string) => {
  const res = await axios.delete(URL + "ticket-type?maLoaiVe=" + maLoaiVe);
  return res.data.data;
};

export const getTicketTypeByPerformanceIDAPI = async (maSuatDien: string) => {
  const res = await axios.get(URL + `performances/${maSuatDien}/ticket-types`);
  console.log(res);
  return res.data.data;
};

export const updatePerformanceAPI = async (
  maSuatDien: string,
  thoiGianBatDau: string,
  thoiGianKetThuc: string,
) => {
  const res = await axiosInstance.patch(URL + "performance", {
    maSuatDien,
    thoiGianBatDau,
    thoiGianKetThuc,
  });

  return res.data.data;
};

export const updateTicketTypeAPI = async (
  tenLoaiVe: string,
  giaTien: number,
  soLuongPhatHanh: number,
  maLoaiVe: string,
  moTa?: string,
) => {
  const res = await axiosInstance.patch(URL + "ticket-type", {
    tenLoaiVe,
    moTa,
    giaTien,
    soLuongPhatHanh,
    maLoaiVe,
  });
  return res.data;
};

export const getTicketsByOrderIDAPI = async (madonhang: string) => {
  const res = await axiosInstance.get(`order/${madonhang}/tickets`);
  return res.data.data;
};
