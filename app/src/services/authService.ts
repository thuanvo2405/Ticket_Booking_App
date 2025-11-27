import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const loginAPI = async (email: string, password: string) => {
  const res = await axios.post(`${URL}login`, { email, matKhau: password });
  return res.data.data;
};

export const loginForAdminAPI = async (email: string, password: string) => {
  const res = await axios.post(`${URL}admin-login`, {
    email,
    matKhau: password,
  });
  return res.data.data;
};

export const signupAPI = async (
  email: string,
  username: string,
  password: string
) => {
  const res = await axios.post(
    `${URL}signup`,
    {
      email,
      tennguoidung: username,
      matkhau: password,
    },
    { validateStatus: () => true }
  );
  return res;
};

export const resetPasswordAPI = async (
  matkhauhientai: string,
  matkhaumoi: string
) => {
  const res = await axiosInstance.patch(`${URL}password`, {
    matkhauhientai,
    matkhaumoi,
  });
  return res.data.data;
};
