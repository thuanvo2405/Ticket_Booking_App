import axios from "axios";
import { URL } from "@/constant/constant";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

const tokens = localStorage.getItem("tokens");
if (tokens) {
  const { accessToken } = JSON.parse(tokens);
  axiosInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken;
}

const refreshAxios = axios.create({
  baseURL: URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshAxios.post("refresh_token", {});
        const { accessToken, refreshToken } = res.data.data.tokens;

        localStorage.setItem(
          "tokens",
          JSON.stringify({ accessToken, refreshToken })
        );

        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
