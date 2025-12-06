import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getEventOrderDetailAPI,
  getEventStatisticsAPI,
} from "@/services/eventService";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";

type PerformanceInfo = {
  maSuatDien: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
};

type OrderRow = {
  madonhang: string;
  ngaydatve?: string;
  trangthai: string;
  tennguoidung?: string;
  tongtien: number;
  performances?: PerformanceInfo[];
};

type OrderItemRow = {
  maloave: string;
  tenloaive: string;
  soluong: number;
  dongia: number;
  thanhtien: number;
  masuatdien?: string;
  thoigianbatdau?: string;
  thoigianketthuc?: string;
};

const currency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const truncate = (value: string, max = 10) =>
  value.length > max ? `${value.slice(0, max)}...` : value;
const formatDateTime = (value?: string, pattern = "dd/MM/yyyy HH:mm") =>
  value ? format(new Date(value), pattern) : "N/A";

export default function EventStatisticsPage() {
  const { maSuKien } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const {
    data: stats,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["eventStatistics", maSuKien],
    queryFn: () => getEventStatisticsAPI(maSuKien as string),
    enabled: !!maSuKien,
  });

  const { data: orderDetail, isFetching: loadingOrderDetail } = useQuery({
    queryKey: ["eventOrderDetail", maSuKien, selectedOrder],
    queryFn: () =>
      getEventOrderDetailAPI(maSuKien as string, selectedOrder as string),
    enabled: !!maSuKien && !!selectedOrder,
  });

  const summary = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Tổng vé đã bán", value: stats.totalTickets.toString() },
      { label: "Doanh thu sự kiện", value: currency(stats.totalRevenue) },
      { label: "Đơn hàng đã thanh toán", value: stats.totalOrders.toString() },
    ];
  }, [stats]);

  const orderColumns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      {
        header: "Mã đơn",
        accessorKey: "madonhang",
        cell: ({ row }) => (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <span className="font-medium">
                  {truncate(row.original.madonhang)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.madonhang}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        header: "Ngày đặt",
        accessorKey: "ngaydatve",
        cell: ({ row }) => formatDateTime(row.original.ngaydatve),
      },
      {
        header: "Suất diễn",
        cell: ({ row }) =>
          row.original.performances && row.original.performances.length > 0 ? (
            <div className="space-y-1">
              {row.original.performances.map((p) => (
                <div key={p.maSuatDien} className="text-xs">
                  {p.thoiGianBatDau
                    ? format(new Date(p.thoiGianBatDau), "dd/MM HH:mm")
                    : ""}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500">N/A</span>
          ),
      },
      {
        header: "Người mua",
        accessorKey: "tennguoidung",
      },
      {
        header: "Tổng tiền",
        accessorKey: "tongtien",
        cell: ({ row }) => (
          <div className="text-right">{currency(row.original.tongtien)}</div>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(row.original.madonhang)}
            >
              Xem đơn hàng
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const orderItemColumns = useMemo<ColumnDef<OrderItemRow>[]>(
    () => [
      {
        header: "Loại vé",
        accessorKey: "tenloaive",
      },
      {
        header: "Suất diễn",
        cell: ({ row }) => (
          <div className="text-xs">
            {row.original.thoigianbatdau
              ? format(new Date(row.original.thoigianbatdau), "dd/MM HH:mm")
              : ""}
          </div>
        ),
      },
      {
        header: "Số lượng",
        accessorKey: "soluong",
        cell: ({ row }) => (
          <div className="text-right">{row.original.soluong}</div>
        ),
      },
      {
        header: "Đơn giá",
        accessorKey: "dongia",
        cell: ({ row }) => (
          <div className="text-right">{currency(row.original.dongia)}</div>
        ),
      },
      {
        header: "Thành tiền",
        accessorKey: "thanhtien",
        cell: ({ row }) => (
          <div className="text-right">{currency(row.original.thanhtien)}</div>
        ),
      },
    ],
    []
  );

  if (isFetching) return <p className="p-4">Đang tải thống kê...</p>;
  if (isError || !stats)
    return <p className="p-4 text-red-600">Không thể tải thống kê.</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              Thống kê sự kiện
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summary.map((item) => (
            <Card key={item.label} className="border-green-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-green-700">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.orders && stats.orders.length > 0 ? (
              <DataTable<OrderRow, unknown>
                columns={orderColumns}
                data={stats.orders}
              />
            ) : (
              <p className="text-sm text-gray-600">Chưa có đơn hàng nào.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              Mã đơn: {selectedOrder || "N/A"}
            </DialogDescription>
          </DialogHeader>

          {loadingOrderDetail ? (
            <p className="text-sm text-gray-600">Đang tải...</p>
          ) : orderDetail ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-3">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium">
                    {orderDetail.order.trangthai}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium">
                    {currency(orderDetail.order.tongtien)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span>
                    {orderDetail.order.ngaydatve
                      ? format(
                          new Date(orderDetail.order.ngaydatve),
                          "dd/MM/yyyy HH:mm"
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <DataTable<OrderItemRow, unknown>
                columns={orderItemColumns}
                data={orderDetail.items}
              />
            </div>
          ) : (
            <p className="text-sm text-red-500">
              Không thể tải chi tiết đơn hàng.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
