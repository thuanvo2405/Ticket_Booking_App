import { Calendar, ClockFading, HandCoins, User } from "lucide-react";

import DashBoardCard from "@/components/AdminPage/DashBoardCard";
import { useQuery } from "@tanstack/react-query";
import { getSummaryReportAPI } from "@/services/reportService";
import LineChartRevenue from "@/components/AdminPage/LineChartRevenue";

export default function AdminPage() {
  const { data, isFetching } = useQuery({
    queryKey: ["fetchSummaryReport"],
    queryFn: getSummaryReportAPI,
  });

  if (isFetching || !data)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold text-gray-600">Loading...</h1>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashBoardCard
          title="Tổng số người dùng"
          value={data.totalUsers}
          icon={<User className="text-blue-500" />}
        />
        <DashBoardCard
          title="Tổng sự kiện đang diễn ra"
          value={data.activeEvents}
          icon={<Calendar className="text-green-500" />}
        />
        <DashBoardCard
          title="Tổng sự kiện chờ duyệt"
          value={data.pendingEvents}
          icon={<ClockFading className="text-yellow-500" />}
        />
        <DashBoardCard
          title="Doanh thu hôm nay"
          value={data.revenueToday.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
          icon={<HandCoins className="text-red-500" />}
        />
      </div>

      <LineChartRevenue />
    </div>
  );
}
