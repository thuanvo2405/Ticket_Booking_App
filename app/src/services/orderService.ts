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

export const retryCheckoutAPI = async (madonhang: string) => {
  const res = await axiosInstance.post(`retry-checkout?madonhang=${madonhang}`);
  return res.data.data;
};

export const getOrdersByUserIDAPI = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `user/orders?page=${page}&limit=${limit}`
  );
  return res.data.data;
};
