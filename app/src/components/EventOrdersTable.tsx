import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getEventOrdersAPI } from "@/services/eventService";
import { formatDateTime, formatPrice } from "@/utils/convert";

type EventOrder = {
  madonhang: string;
  tennguoidung: string;
  email: string;
  tongtien: number;
  trangthai: string;
  ngaydatve: string;
  thoigianthanhtoan: string | null;
  totalTickets: number;
};

type EventOrdersTableProps = {
  maSuKien: string;
  pageSize?: number;
};

export function EventOrdersTable({
  maSuKien,
  pageSize = 8,
}: EventOrdersTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching, isError } = useQuery<{
    orders: EventOrder[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ["event-orders", maSuKien, page, debouncedSearch, pageSize],
    queryFn: () =>
      getEventOrdersAPI(maSuKien, {
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
      }),
    enabled: Boolean(maSuKien),
    placeholderData: (previous) => previous,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (data?.limit ?? pageSize)));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const columns: ColumnDef<EventOrder>[] = useMemo(
    () => [
      {
        accessorKey: "madonhang",
        header: "Mã đơn",
        cell: ({ row }) => (
          <span className="font-semibold uppercase tracking-wide">
            {row.getValue("madonhang")}
          </span>
        ),
      },
      {
        accessorKey: "tennguoidung",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("tennguoidung")}</span>
            <span className="text-xs text-gray-500">
              {(row.original.email || "").toLowerCase()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "totalTickets",
        header: "Số vé",
        cell: ({ row }) => (
          <span className="font-semibold">{row.getValue("totalTickets")}</span>
        ),
      },
      {
        accessorKey: "tongtien",
        header: "Tổng tiền",
        cell: ({ row }) => (
          <span className="font-semibold text-green-700">
            {formatPrice(row.getValue("tongtien") as number)}
          </span>
        ),
      },
      {
        accessorKey: "thoigianthanhtoan",
        header: "Thanh toán lúc",
        cell: ({ row }) => {
          const paidAt = row.getValue("thoigianthanhtoan") as string | null;
          const fallback = row.original.ngaydatve;

          return (
            <span className="text-sm text-gray-700">
              {paidAt ? formatDateTime(paidAt) : formatDateTime(fallback)}
            </span>
          );
        },
      },
      {
        accessorKey: "trangthai",
        header: "Trạng thái",
        cell: () => (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            Đã thanh toán
          </span>
        ),
      },
    ],
    []
  );

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () =>
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Đơn hàng sự kiện</h2>
          <p className="text-sm text-gray-500">
            Theo dõi các đơn đã thanh toán của sự kiện
          </p>
        </div>

        <Input
          placeholder="Tìm mã đơn, tên hoặc email khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-80"
        />
      </div>

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Đang tải danh sách đơn hàng...
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={data?.orders ?? []} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {data?.orders?.length ?? 0} trên tổng {total} đơn
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={page === 1 || isFetching}
              >
                Trước
              </Button>
              <span className="text-sm font-medium">
                Trang {page}/{totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={page >= totalPages || isFetching || total === 0}
              >
                Sau
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
