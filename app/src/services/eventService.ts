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

export const fetchProfileEventsByOrganizerID = async ({
  trangThai,
  page = 1,
  limit = 10,
}: {
  trangThai?: string;
  page?: number;
  limit?: number;
}) => {
  const params: Record<string, string | number> = { page, limit };
  if (trangThai) params.trangThai = trangThai;

  const res = await axiosInstance.get("organizer/events", { params });
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

export const getSuggestedEventsAPI = async () => {
  const res = await axios.get(URL + `events_suggest`);
  return res.data.data;
};

export const getSpecialEventsAPI = async () => {
  const res = await axios.get(URL + `events_special`);
  return res.data.data;
};

export const getMaybeLikeEventsAPI = async () => {
  const res = await axios.get(URL + `events_maybe_like`);
  return res.data.data;
};

export const getEventOverviewAPI = async (maSuKien: string) => {
  const res = await axiosInstance.get(`event/${maSuKien}/statistics`);
  return res.data.data;
};

export const getSessionStatisticsAPI = async (
  maSuKien: string,
  maSuatDien: string
) => {
  const res = await axiosInstance.get(
    `event/${maSuKien}/session/${maSuatDien}`
  );
  return res.data.data;
};

export const getEventChartsAPI = async (
  maSuKien: string,
  maSuatDien: string,
  range: "30d" | "24h"
) => {
  const res = await axiosInstance.get(
    `event/${maSuKien}/charts?session=${maSuatDien}&range=${range}`
  );
  return res.data.data;
};

export const getEventOrdersAPI = async (
  maSuKien: string,
  params?: { page?: number; limit?: number; search?: string }
) => {
  const res = await axiosInstance.get(`event/${maSuKien}/orders`, {
    params,
  });
  return res.data.data;
};

export const getEventOrderDetailAPI = async (
  maSuKien: string,
  madonhang: string
) => {
  const res = await axiosInstance.get(`event/${maSuKien}/orders/${madonhang}`);
  return res.data.data;
};

export const searchEventsForUserAPI = async ({
  page = 1,
  limit = 12,
  from,
  to,
  khuVuc,
  tenLoaiSuKien,
  tenSuKien,
  signal,
}: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  khuVuc?: string;
  tenLoaiSuKien?: string;
  maToChuc?: string;
  tenSuKien?: string;
  signal?: AbortSignal;
}) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (khuVuc) params.append("khuVuc", khuVuc);
  if (tenLoaiSuKien) params.append("tenLoaiSuKien", tenLoaiSuKien);
  if (tenSuKien) params.append("tenSuKien", tenSuKien);

  const res = await axios.get(`${URL}user/events?${params.toString()}`, {
    signal,
  });
  return res.data.data;
};
