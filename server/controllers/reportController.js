import handleResponse from "../utils/handleResponse.js";

import {
  getTotalUserService,
  getActiveEventsService,
  getPendingEventsService,
  getRevenueTodayService,
  getTotalTicketForAdminService,
  getTotalOrderForAdminService,
  getTotalRevenueForAdminService,
  getTotalEventForAdminService,
  getRevenueServive,
  getRevenueByDateRangeService,
} from "../models/reportModel.js";
import pool from "../config/db.js";

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

export const getSummaryForOrganizer = async (req, res, next) => {
  try {
    const userID = req.user.user.id;

    const result = await pool.query(
      `Select * from to_chuc where manguoidung = $1`,
      [userID]
    );

    const matochuc = result.rows[0].matochuc;

    if (!matochuc) {
      return handleResponse(res, 400, "Không tìm thấy mã tổ chức");
    }

    const [totalTicket, totalOrder, totalRevenue, totalEvent] =
      await Promise.all([
        getTotalTicketForAdminService(matochuc),
        getTotalOrderForAdminService(matochuc),
        getTotalRevenueForAdminService(matochuc),
        getTotalEventForAdminService(matochuc),
      ]);

    handleResponse(res, 200, "Lấy summary dashboard thành công", {
      totalTicket,
      totalOrder,
      totalRevenue,
      totalEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return handleResponse(
        res,
        400,
        "Vui lòng cung cấp đầy đủ ngày bắt đầu và ngày kết thúc"
      );
    }

    const result = await getRevenueServive(from, to);
    const formattedResult = result.map((item) => ({
      date: item.date,
      doanhthu: Number(item.revenue ?? 0),
    }));

    handleResponse(
      res,
      200,
      "Lấy báo cáo doanh thu theo khoảng ngày thành công",
      formattedResult
    );
  } catch (error) {
    next(error);
  }
};

export const getRevenueByDateRangeForAdmin = async (req, res, next) => {
  try {
    const userID = req.user?.user?.id;
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return handleResponse(res, 400, "Vui lòng chọn từ ngày đến ngày");
    }

    const result = await pool.query(
      "SELECT * FROM to_chuc WHERE manguoidung = $1",
      [userID]
    );

    const matochuc = result.rows[0]?.matochuc;
    if (!matochuc) {
      return handleResponse(res, 400, "Không tìm thấy mã tổ chức");
    }

    const revenue = await getRevenueByDateRangeService(
      matochuc,
      fromDate,
      toDate
    );

    handleResponse(res, 200, "Lấy doanh thu thành công", {
      data: revenue,
    });
  } catch (error) {
    next(error);
  }
};
