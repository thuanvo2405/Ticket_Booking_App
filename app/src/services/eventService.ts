import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const getEventsAPI = async ({
  page = 1,
  limit = 10,
  trangThai,
  from,
  to,
  viTri,
  maLoaiSuKien,
  maToChuc,
  tenSuKien,
}: {
  page?: number;
  limit?: number;
  trangThai?: string;
  from?: string;
  to?: string;
  viTri?: string;
  maLoaiSuKien?: string;
  maToChuc?: string;
  tenSuKien?: string;
}) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (trangThai) params.append("trangThai", trangThai);
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (viTri) params.append("viTri", viTri);
  if (maLoaiSuKien) params.append("maLoaiSuKien", maLoaiSuKien);
  if (maToChuc) params.append("maToChuc", maToChuc);
  if (tenSuKien) params.append("tenSuKien", tenSuKien);

  const res = await axios.get(`${URL}events?${params.toString()}`);
  return res.data.data;
};

export const getEventByIdAPI = async (maSuKien: string) => {
  const res = await axios.get(URL + `event?maSuKien=${maSuKien}`);
  return res.data.data;
};

export const createEventAPI = async (
  tenSuKien: string,
  anhSuKienNgang: File,
  anhSuKienDoc: File,
  moTa: string,
  diaChi: string,
  phuong: string,
  quan: string,
  thanhPho: string,
  maLoaiSuKien: string
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
  formData.append("maLoaiSuKien", maLoaiSuKien);

  const res = await axiosInstance.post(URL + "event", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const updateEventAPI = async (
  maSuKien: string,
  tenSuKien: string,
  anhSuKienNgang: File,
  anhSuKienDoc: File,
  moTa: string,
  diaChi: string,
  phuong: string,
  quan: string,
  thanhPho: string,
  maloaisukien: string
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
  formData.append("maLoaiSuKien", maloaisukien);

  const res = await axiosInstance.patch(
    URL + `event?maSuKien=${maSuKien}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.data;
};

export const updateEventStatusAPI = async (
  maSuKien: string,
  trangThai: string
) => {
  const res = await axiosInstance.patch(
    URL + `event-status?maSuKien=${maSuKien}`,
    {
      trangThai,
    }
  );

  return res.data.data;
};

export const fetchProfileEventsByOrganizerID = async (trangThai?: string) => {
  const params = trangThai ? { trangThai } : {};
  const res = await axios.get(URL + "organizer/events", { params });
  return res.data.data;
};

export const getEventTypesAPI = async () => {
  const res = await axios.get(URL + `event-types`);
  return res.data.data;
};

export const deleteEventAPI = async (maSuKien: string) => {
  const res = await axiosInstance.delete(URL + `event?maSuKien=` + maSuKien);
  return res.data.data;
};
