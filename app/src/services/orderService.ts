import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const getOrderByIDAPI = async (madonhang: string) => {
  const res = await axiosInstance.get(`order/${madonhang}`);
  return res.data.data;
};

export const createOrderAPI = async (orderData: any) => {
  const res = await axiosInstance.post("order", orderData);
  return res.data.data;
};

export const checkOutAPI = async (madonhang: string, makhuyenmai: string) => {
  const res = await axiosInstance.post(`checkout?madonhang=${madonhang}`, {
    makhuyenmai,
  });
  return res.data.data;
};

export const getOrdersByUserIDAPI = async () => {
  const res = await axiosInstance.get("user/orders");
  return res.data.data;
};
