import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const getPromotionAPI = async (maSuKien: string) => {
  const res = await axios.get(URL + "promotion?maSuKien=" + maSuKien);
  return res.data.data;
};

export const deletePromotionAPI = async (maKhuyenMai: string) => {
  const res = await axiosInstance.delete(
    URL + "promotion?maKhuyenMai=" + maKhuyenMai
  );
  return res.data.data;
};

export const CreatePromotionAPI = async (
  maGiamGia: string,
  giaTriGiam: number,
  loaiGiam: string,
  ngayBatDau: string,
  ngayKetThuc: string,
  soLuongPhatHanh: number,
  giaTriToiThieu: number,
  maSuKien: string
) => {
  const res = await axiosInstance.post(URL + "promotion", {
    maGiamGia,
    giaTriGiam,
    loaiGiam,
    ngayBatDau,
    ngayKetThuc,
    soLuongPhatHanh,
    giaTriToiThieu,
    maSuKien,
  });

  return res.data.data;
};
