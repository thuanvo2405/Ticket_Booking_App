import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "@/constant/constant";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminPath = window.location.pathname.startsWith("/admin");
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      const confirm = toast(
        "Phiên đăng nhập đã hết hạn. Bạn có muốn đăng nhập lại không?"
      );
      if (isAdminPath) {
        localStorage.removeItem("admin_tokens");
        localStorage.removeItem("admin_user");
        if (confirm) window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        if (confirm) window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
