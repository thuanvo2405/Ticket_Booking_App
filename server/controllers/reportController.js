import handleResponse from "../utils/handleResponse.js";

import {
  getTotalUserService,
  getActiveEventsService,
  getPendingEventsService,
  getRevenueTodayService,
  getRevenueServive,
} from "../models/reportModel.js";

export const getTotalUser = async (req, res, next) => {
  try {
    const result = await getTotalUserService();
    handleResponse(
      res,
      200,
      "Lấy thông tin tổng người dùng thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getActiveEvents = async (req, res, next) => {
  try {
    const result = await getActiveEventsService();
    handleResponse(
      res,
      200,
      "Lấy thông tin sự kiện đã được duyệt thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getPendingEvents = async (req, res, next) => {
  try {
    const result = await getPendingEventsService();
    handleResponse(
      res,
      200,
      "Lấy thông tin sự kiện đang chờ duyệt thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getRevenueToday = async (req, res, next) => {
  try {
    const result = await getRevenueTodayService();
    handleResponse(
      res,
      200,
      "Lấy thông tin tổng doanh thu hôm nay thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const [totalUsers, activeEvents, pendingEvents, revenueToday] =
      await Promise.all([
        getTotalUserService(),
        getActiveEventsService(),
        getPendingEventsService(),
        getRevenueTodayService(),
      ]);

    handleResponse(res, 200, "Lấy summary dashboard thành công", {
      totalUsers: totalUsers[0].count,
      activeEvents: activeEvents[0].count,
      pendingEvents: pendingEvents[0].count,
      revenueToday: revenueToday.revenue,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const result = await getRevenueServive(from, to);

    handleResponse(
      res,
      200,
      "Lấy báo cáo doanh thu theo khoảng ngày thành công",
      result
    );
  } catch (error) {
    next(error);
  }
};
