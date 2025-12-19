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
  getDailyRevenueOrganizerAPI,
  getSummaryReportForAdminAPI,
} from "@/services/reportService";
import { formatPrice } from "@/utils/convert";
import { memo, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const chartConfig = {
  desktop: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const SummaryCards = memo(
  ({
    totalTicket,
    totalOrder,
    totalRevenue,
    totalEvent,
  }: {
    totalTicket: number;
    totalOrder: number;
    totalRevenue: number;
    totalEvent: number;
  }) => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <DashBoardCard
        title="Tổng số lượng vé đã bán"
        value={totalTicket}
        icon={<Ticket className="text-blue-500" />}
      />
      <DashBoardCard
        title="Tổng số đơn hàng"
        value={totalOrder}
        icon={<ShoppingBag className="text-red-500" />}
      />
      <DashBoardCard
        title="Tổng doanh thu"
        value={formatPrice(totalRevenue)}
        icon={<CirclePoundSterling className="text-orange-500" />}
      />
      <DashBoardCard
        title="Tổng sự kiện của bạn"
        value={totalEvent}
        icon={<Package className="text-yellow-500" />}
      />
    </div>
  )
);

const toParam = (d?: Date) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    : "";

const label = (d?: Date) => (d ? d.toLocaleDateString("vi-VN") : "");

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [openRange, setOpenRange] = useState(false);

  const from = range?.from;
  const to = range?.to;

  const fromParam = useMemo(() => toParam(from), [from]);
  const toParamStr = useMemo(() => toParam(to), [to]);
  const enabled = !!fromParam && !!toParamStr;

  const { data: summaryReport, isFetching: fetchingSummary } = useQuery({
    queryKey: ["fetchingReportForAdmin"],
    queryFn: getSummaryReportForAdminAPI,
  });

  const { data: dailyRevenue, isFetching: fetchingRevenue } = useQuery({
    queryKey: ["fetchingDailyRevenue", fromParam, toParamStr],
    queryFn: () => getDailyRevenueOrganizerAPI(fromParam, toParamStr),
    enabled,
  });

  if (fetchingSummary || fetchingRevenue) return <h1>Loading...</h1>;
  if (!summaryReport) return <div className="p-4">Không có dữ liệu</div>;

  const revenueData = (dailyRevenue?.data ?? []).map((item: any) => ({
    date: item.date,
    desktop: Number(item.revenue),
  }));

  const rangeText =
    from && to ? `Từ ${label(from)} đến ${label(to)}` : "Chọn khoảng ngày";

  return (
    <div>
      <SummaryCards
        totalTicket={summaryReport.totalTicket}
        totalOrder={summaryReport.totalOrder}
        totalRevenue={summaryReport.totalRevenue}
        totalEvent={summaryReport.totalEvent}
      />

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
          <CardDescription>
            {from && to ? rangeText : "Vui lòng chọn khoảng thời gian"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <Popover open={openRange} onOpenChange={setOpenRange}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {rangeText}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={range}
                  defaultMonth={from}
                  onSelect={(next) => {
                    setRange(next);
                    if (next?.from && next?.to) setOpenRange(false);
                  }}
                  className="rounded-lg border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>

          {!enabled && (
            <div className="text-sm text-gray-500">
              Chọn từ ngày và đến ngày để xem doanh thu
            </div>
          )}

          {enabled && revenueData.length === 0 && (
            <div className="text-sm text-gray-500">
              Không có doanh thu trong khoảng thời gian này
            </div>
          )}

          {enabled && revenueData.length > 0 && (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={revenueData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
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
