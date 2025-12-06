import axios from "axios";
import { URL } from "@/constant/constant";
import axiosInstance from "./axiosInstance";

export const getSummaryReportAPI = async () => {
  const res = await axiosInstance.get("report-summary");
  return res.data.data;
};

export const getSummaryReportForAdminAPI = async () => {
  const res = await axiosInstance.get(`organizer/report-summary`);
  return res.data.data;
};

export const getRevenueAPI = async (from: string, to: string) => {
  const res = await axiosInstance.get("report-revenue", {
    params: { from, to },
  });
  return res.data.data;
};

export const getMonthlyRevenueOrganzierAPI = async () => {
  const res = await axiosInstance.get("organizer/report-revenue");
  return res.data.data;
};
