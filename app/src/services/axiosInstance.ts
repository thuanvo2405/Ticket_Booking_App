import axios from "axios";
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

export default axiosInstance;
