import axiosInstance from "./axiosInstance";

export const getCheckinStatsAPI = async (maSuatDien: string) => {
  const res = await axiosInstance.get("checkin-stats", {
    params: { maSuatDien },
  });
  return res.data.data;
};

export const checkinAPI = async (qrCode: string, maSuatDien: string) => {
  const res = await axiosInstance.post("checkin", { qrCode, maSuatDien });
  return res.data;
};
