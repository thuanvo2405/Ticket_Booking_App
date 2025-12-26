import { DataTable } from "@/components/data-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrdersByUserIDAPI,
  retryCheckoutAPI,
} from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink } from "react-router-dom";

export type UserOrder = {
  madonhang: string;
  tongtien: string;
  trangthai: "CHO_THANH_TOAN" | "DA_THANH_TOAN" | "HET_HAN";
  ngaydatve: string;
  thoihanthanhtoan: string;
  thoigianthantoan: string | null;
};

type UserOrderResponse = {
  items: UserOrder[];
  total: number;
  page: number;
  limit: number;
};

export default function MyOrderPage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data } = useQuery<UserOrderResponse>({
    queryKey: ["userOrders", page, limit],
    queryFn: () => getOrdersByUserIDAPI(page, limit),
    placeholderData: (prev) => prev,
  });

  const retryPaymentMutation = useMutation({
    mutationFn: (madonhang: string) => retryCheckoutAPI(madonhang),
    onSuccess: (data) => {
      window.location.href = data.payUrl;
    },
    onError: (error) => {
      console.error("Checkout failed:", error);
    },
  });

  const userOrderColumns: ColumnDef<UserOrder>[] = [
    {
      accessorKey: "madonhang",
      header: "Mã đơn hàng",
      cell: ({ row }) => {
        const fullId = row.getValue("madonhang") as string;
        const shortId = fullId.slice(0, 8);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer uppercase">{shortId}...</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="uppercase">{fullId}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "tongtien",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span>{Number(row.getValue("tongtien")).toLocaleString()} đ</span>
      ),
    },
    {
      accessorKey: "trangthai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const value = row.getValue("trangthai") as string;

        const colorMap: Record<string, string> = {
          CHO_THANH_TOAN: "text-yellow-600",
          DA_THANH_TOAN: "text-green-600",
          HET_HAN: "text-red-600",
        };

        const labelMap: Record<string, string> = {
          CHO_THANH_TOAN: "Chờ thanh toán",
          DA_THANH_TOAN: "Đã thanh toán",
          HET_HAN: "Hết hạn",
        };

        return (
          <span className={colorMap[value] || "text-black"}>
            {labelMap[value] || value}
          </span>
        );
      },
    },
    {
      accessorKey: "ngaydatve",
      header: "Ngày đặt",
      cell: ({ row }) => {
        const date = new Date(row.getValue("ngaydatve"));
        return <span>{date.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "thoihanthanhtoan",
      header: "Hạn thanh toán",
      cell: ({ row }) => {
        const status = row.getValue("trangthai") as string;
        if (status === "DA_THANH_TOAN") {
          return (
            <span className="text-green-600 font-semibold">Đã thanh toán</span>
          );
        }

        const deadline = new Date(row.getValue("thoihanthanhtoan"));
        const now = new Date();

        const isExpired = deadline < now;

        return isExpired ? (
          <span className="text-red-600 font-semibold">Hết hạn thanh toán</span>
        ) : (
          <span>{deadline.toLocaleString()}</span>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex gap-2">
            <NavLink to={`/my-order/${row.original.madonhang}`}>Xem</NavLink>
            {order.trangthai === "CHO_THANH_TOAN" && (
              <Button
                onClick={() => retryPaymentMutation.mutate(order.madonhang)}
              >
                Thanh toán
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>

      <DataTable columns={userOrderColumns} data={data?.items || []} />

      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <div>Trang {page}</div>

        <Button
          variant="outline"
          onClick={() =>
            setPage((p) => (p * limit < (data?.total ?? 0) ? p + 1 : p))
          }
          disabled={page * limit >= (data?.total ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
