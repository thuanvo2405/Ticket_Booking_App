import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const getOrganizerProfileAPI = async () => {
  const res = await axiosInstance.get("organizer-profile");
  return res.data.data;
};

export const createOrganizerProfileAPI = async (
  moTa: string,
  anhDaiDien: File,
  tenToChuc: string
) => {
  const formData = new FormData();
  formData.append("moTa", moTa);
  formData.append("tenToChuc", tenToChuc);
  formData.append("media", anhDaiDien);

  const res = await axiosInstance.post(URL + "organizer-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateOrganizerProfileAPI = async (
  tentochuc?: string,
  mota?: string,
  anhtochuc?: File
) => {
  const formData = new FormData();
  if (tentochuc) {
    formData.append("tentochuc", tentochuc);
  }
  if (mota) {
    formData.append("mota", mota);
  }
  if (anhtochuc) {
    formData.append("anhtochuc", anhtochuc);
  }

  const res = await axiosInstance.patch(URL + "organizer-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};
