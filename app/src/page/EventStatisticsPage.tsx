import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Progress } from "@/components/ui/progress";
import { RadiantChart } from "@/components/RadiantChart";
import { EventLineChart } from "@/components/EventLineChart";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  getEventOverviewAPI,
  getSessionStatisticsAPI,
  getEventChartsAPI,
} from "@/services/eventService";
import { formatFullDateTime, formatPrice } from "@/utils/convert";

type ChartPoint = {
  date: string;
  tickets: number;
  revenue: number;
};

type TicketRow = {
  maLoaiVe: string;
  type: string;
  price: number;
  sold: number;
  total: number;
  locked: number;
};

type SessionOverview = {
  maSuatDien: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string | null;
  totalTickets: number;
  soldTickets: number;
  lockedTickets: number;
  potentialRevenue: number;
  revenue: number;
};

type EventOverviewResponse = {
  overview: {
    totalTickets: number;
    soldTickets: number;
    lockedTickets: number;
    totalRevenue: number;
    potentialRevenue: number;
    totalOrders: number;
  };
  sessions: SessionOverview[];
};

type SessionStatisticsResponse = {
  session: {
    maSuatDien: string;
    soldTickets: number;
    totalTickets: number;
    lockedTickets: number;
    revenue: number;
    potentialRevenue: number;
    ticketTypes: {
      maLoaiVe: string;
      type: string;
      price: number;
      sold: number;
      total: number;
      locked: number;
    }[];
  };
};

export default function EventStatisticsPage() {
  const { maSuKien } = useParams<{ maSuKien: string }>();
  const [session, setSession] = useState<string | null>(null);
  const [range, setRange] = useState<"24h" | "30d">("30d");

  const {
    data: overviewData,
    isLoading: loadingOverview,
    isError: overviewError,
  } = useQuery<EventOverviewResponse>({
    queryKey: ["event-overview", maSuKien],
    queryFn: () => getEventOverviewAPI(maSuKien || ""),
    enabled: Boolean(maSuKien),
  });

  useEffect(() => {
    if (overviewData?.sessions?.length && !session) {
      setSession(overviewData.sessions[0].maSuatDien);
    }
  }, [overviewData, session]);

  const {
    data: sessionData,
    isLoading: loadingSession,
    isError: sessionError,
  } = useQuery<SessionStatisticsResponse>({
    queryKey: ["event-session", maSuKien, session],
    queryFn: () => getSessionStatisticsAPI(maSuKien || "", session || ""),
    enabled: Boolean(maSuKien && session),
  });

  const {
    data: chartRes,
    isLoading: loadingChart,
    isError: chartError,
  } = useQuery<{ data: ChartPoint[] }>({
    queryKey: ["event-chart", maSuKien, session, range],
    queryFn: () => getEventChartsAPI(maSuKien || "", session || "", range),
    enabled: Boolean(maSuKien && session),
  });

  const columns: ColumnDef<TicketRow>[] = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Loại vé",
        cell: ({ row }) => (
          <div className="capitalize font-medium">{row.getValue("type")}</div>
        ),
      },
      {
        accessorKey: "price",
        header: "Giá bán",
        cell: ({ row }) => (
          <div>{formatPrice(row.getValue("price") as number)}</div>
        ),
      },
      {
        accessorKey: "sold",
        header: "Đã bán",
        cell: ({ row }) => {
          const sold = row.getValue("sold") as number;
          const total = row.original.total;
          return (
            <div className="font-semibold">
              {sold} / {total}
            </div>
          );
        },
      },
      {
        accessorKey: "locked",
        header: "Bị khoá",
        cell: ({ row }) => <div>{row.getValue("locked")}</div>,
      },
      {
        id: "percent",
        header: () => <div className="text-right">Tỉ lệ bán</div>,
        cell: ({ row }) => {
          const { sold, total } = row.original;
          const percent = total > 0 ? (sold / total) * 100 : 0;

          return (
            <div className="flex items-center justify-end gap-3">
              <div className="w-40">
                <Progress value={percent} className="h-3 bg-gray-200" />
              </div>
              <span className="text-sm font-semibold">
                {percent.toFixed(0)}%
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const ticketData: TicketRow[] = useMemo(() => {
    if (!sessionData?.session) return [];
    return sessionData.session.ticketTypes.map((ticket) => ({
      maLoaiVe: ticket.maLoaiVe,
      type: ticket.type,
      price: ticket.price,
      sold: ticket.sold,
      total: ticket.total,
      locked: ticket.locked,
    }));
  }, [sessionData?.session]);

  const chartData = chartRes?.data ?? [];
  console.log(chartData);

  if (loadingOverview || loadingSession || loadingChart)
    return <div className="p-4">Đang tải thống kê...</div>;
  if (overviewError || sessionError || chartError || !overviewData)
    return <div className="p-4">Không thể tải dữ liệu thống kê</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Thống kê sự kiện</h1>

        <Select
          onValueChange={setSession}
          value={session ?? undefined}
          disabled={!overviewData.sessions.length}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Chọn suất diễn" />
          </SelectTrigger>
          <SelectContent>
            {overviewData.sessions.map((item) => (
              <SelectItem key={item.maSuatDien} value={item.maSuatDien}>
                {formatFullDateTime(
                  item.thoiGianBatDau,
                  item.thoiGianKetThuc || item.thoiGianBatDau
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <RadiantChart
          text="Doanh thu"
          unit="đ"
          value={sessionData?.session.revenue ?? 0}
          totalValue={
            sessionData?.session.potentialRevenue ??
            sessionData?.session.revenue ??
            0
          }
        />
        <RadiantChart
          text="Vé"
          unit="vé"
          value={sessionData?.session.soldTickets ?? 0}
          totalValue={sessionData?.session.totalTickets ?? 0}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setRange("24h")}
          className={`px-4 py-2 rounded-lg border ${
            range === "24h" ? "bg-white text-black" : ""
          }`}
        >
          24 giờ
        </button>

        <button
          onClick={() => setRange("30d")}
          className={`px-4 py-2 rounded-lg border ${
            range === "30d" ? "bg-white text-black" : ""
          }`}
        >
          30 ngày
        </button>
      </div>

      <EventLineChart data={chartData} />

      <div>
        <h2 className="text-xl font-bold mb-2">Vé đã bán</h2>
        <DataTable columns={columns} data={ticketData} />
      </div>
    </div>
  );
}
