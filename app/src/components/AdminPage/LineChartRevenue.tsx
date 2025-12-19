import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getRevenueAPI } from "@/services/reportService";
export const description = "An interactive line chart";
const chartConfig = {
  views: {
    label: "Doanh thu",
  },
  doanhthu: {
    label: "doanhthu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function LineChartRevenue() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("doanhthu");

  const [openStartDate, setOpenStartDate] = React.useState(false);
  const [openEndDate, setOpenEndDate] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [chartData, setChartData] = React.useState<
    { date: string; doanhthu: number }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 6);
    setStartDate(defaultStart);
    setEndDate(today);
  }, []);

  React.useEffect(() => {
    const fetchRevenue = async () => {
      if (!startDate || !endDate) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const from = startDate.toISOString().split("T")[0];
        const to = endDate.toISOString().split("T")[0];
        const data = await getRevenueAPI(from, to);
        setChartData(data ?? []);
      } catch (error) {
        console.error(error);
        setErrorMessage("Không thể tải dữ liệu doanh thu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenue();
  }, [startDate, endDate]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h2>
      <div className="my-2 flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Ngày bắt đầu
          </Label>
          <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {startDate ? startDate.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setStartDate(date);
                  setOpenStartDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Ngày kết thúc
          </Label>
          <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {endDate ? endDate.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setEndDate(date);
                  setOpenEndDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 px-1 mb-2">{errorMessage}</p>
      )}
      <div>
        <Card className="py-4 sm:py-0">
          <CardContent className="px-2 sm:p-6">
            {chartData.length === 0 && !isLoading ? (
              <p className="text-center text-sm text-muted-foreground">
                Không có dữ liệu trong khoảng thời gian đã chọn.
              </p>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey={activeChart}
                    type="monotone"
                    stroke={`var(--color-${activeChart})`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
