import DashBoardCard from "@/components/AdminPage/DashBoardCard";
import {
  CirclePoundSterling,
  Package,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import {
  getMonthlyRevenueOrganzierAPI,
  getSummaryReportForAdminAPI,
} from "@/services/reportService";
import { formatPrice } from "@/utils/convert";
export const description = "A bar chart";

const chartConfig = {
  desktop: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const convertRevenueData = (data: any) => {
  if (!data || data.length === 0) return [];

  return data.map((item: any) => {
    const date = new Date(item.month + "-01");
    const monthLabel = date.toLocaleString("en-US", { month: "short" });

    return {
      month: monthLabel,
      desktop: Number(item.revenue),
    };
  });
};

export default function DashboardPage() {
  const { data: summaryReport, isFetching } = useQuery({
    queryKey: ["fetchingReportForAdmin"],
    queryFn: getSummaryReportForAdminAPI,
  });

  const { data: monthlyRevenue, isFetching: fetchingRevenue } = useQuery({
    queryKey: [`fetchingMonthlyRevenue`],
    queryFn: getMonthlyRevenueOrganzierAPI,
  });

  if (isFetching || fetchingRevenue) return <h1>Loading</h1>;

  const hasSummary =
    summaryReport &&
    typeof summaryReport.totalTicket !== "undefined" &&
    typeof summaryReport.totalOrder !== "undefined" &&
    typeof summaryReport.totalRevenue !== "undefined" &&
    typeof summaryReport.totalEvent !== "undefined";

  const revenueData = convertRevenueData(monthlyRevenue?.data);

  if (!hasSummary) return <div className="p-4">Không có dữ liệu</div>;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <DashBoardCard
          title="Tổng số lượng vé đã bán"
          value={summaryReport.totalTicket}
          icon={<Ticket className="text-blue-500" />}
        />
        <DashBoardCard
          title="Tổng số đơn hàng"
          value={summaryReport.totalOrder}
          icon={<ShoppingBag className="text-red-500" />}
        />
        <DashBoardCard
          title="Tổng số doanh thu"
          value={formatPrice(summaryReport.totalRevenue)}
          icon={<CirclePoundSterling className="text-orange-500" />}
        />
        <DashBoardCard
          title="Tổng sự kiện của bạn"
          value={summaryReport.totalEvent}
          icon={<Package className="text-yellow-500" />}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
          <CardDescription>Tháng 1 - Tháng 12 2025</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="text-sm text-gray-500">Chưa có dữ liệu doanh thu</div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={revenueData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
