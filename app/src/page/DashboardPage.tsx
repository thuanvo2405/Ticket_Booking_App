import DashBoardCard from "@/components/AdminPage/DashBoardCard";
import {
  CirclePoundSterling,
  Package,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { getSummaryReportForAdminAPI } from "@/services/reportService";
import { formatPrice } from "@/utils/convert";
export const description = "A bar chart";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const { data: summaryReport, isFetching } = useQuery({
    queryKey: ["fetchingReportForAdmin"],
    queryFn: getSummaryReportForAdminAPI,
  });

  console.log(summaryReport);

  if (isFetching) return <h1>Loading</h1>;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
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
          <CardTitle>Bar Chart</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
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
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
