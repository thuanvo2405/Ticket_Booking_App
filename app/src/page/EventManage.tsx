import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsAPI, updateEventStatusAPI } from "@/services/eventService";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EventProfileModal } from "@/components/AdminPage/EventProfileModal";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type EventProfile = {
  masukien: string;
  tensukien: string;
  mota: string;
  trangthai: "CHO_DUYET" | "DA_DUYET" | "HUY" | "NHAP" | "TU_CHOI";
  tentochuc: string;
  tenloaisukien: string;
};

export default function EventManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "approved" | "pending" | "rejected">(
    "all"
  );
  const limit = 5;

  const queryClient = useQueryClient();

  const statusFilter = useMemo(() => {
    switch (tab) {
      case "approved":
        return "DA_DUYET";
      case "pending":
        return "CHO_DUYET";
      case "rejected":
        return "TU_CHOI";
      default:
        return undefined;
    }
  }, [tab]);

  const { data } = useQuery({
    queryKey: ["events", page, statusFilter, search],
    queryFn: () =>
      getEventsAPI({ page, limit, trangThai: statusFilter, tenSuKien: search }),
    placeholderData: (previous) => previous,
  });

  const handleAccept = useMutation({
    mutationFn: (maSuKien: string) =>
      updateEventStatusAPI(maSuKien, "DA_DUYET"),
    onSuccess: () => {
      toast.success("Duyệt sự kiện thành công");
      queryClient.invalidateQueries({ queryKey: ["events", page] });
    },
    onError: () => {
      toast.error("Duyệt thất bại");
    },
  });

  const handleReject = useMutation({
    mutationFn: (maSuKien: string) => updateEventStatusAPI(maSuKien, "TU_CHOI"),
    onSuccess: () => {
      toast.success("Duyệt sự kiện thành công");
      queryClient.invalidateQueries({ queryKey: ["events", page] });
    },
    onError: () => {
      toast.error("Duyệt thất bại");
    },
  });

  const columns: ColumnDef<EventProfile>[] = [
    {
      accessorKey: "tensukien",
      header: "Tên sự kiện",
    },
    {
      accessorKey: "trangthai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const value = row.getValue("trangthai") as string;

        const statusMap: Record<string, { label: string; className: string }> =
          {
            CHO_DUYET: { label: "Chờ duyệt", className: "text-yellow-600" },
            DA_DUYET: { label: "Đã duyệt", className: "text-green-600" },
            TU_CHOI: { label: "Từ chối", className: "text-red-600" },
            HUY: { label: "Hủy", className: "text-red-600" },
            NHAP: { label: "Nháp", className: "text-gray-500" },
            DA_DIEN_RA: { label: "Đã diễn ra", className: "text-blue-600" },
          };

        const status = statusMap[value];

        return (
          <span className={status?.className || "text-black"}>
            {status?.label || value}
          </span>
        );
      },
    },
    {
      accessorKey: "tentochuc",
      header: "Tên tổ chức",
    },
    {
      accessorKey: "tenloaisukien",
      header: "Loại sự kiện",
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const event = row.original;
        const showActions = event.trangthai === "CHO_DUYET";
        return (
          <div className="flex gap-2">
            <EventProfileModal
              event={event}
              onApprove={(id) => handleAccept.mutate(id)}
              onReject={(id) => handleReject.mutate(id)}
              disableActions={!showActions}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xl">Quản lý sự kiện</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Input
            placeholder="Tìm kiếm tên sự kiện"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Tabs
          value={tab}
          onValueChange={(val) => {
            setTab(val as typeof tab);
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="rejected">Từ chối</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} data={data?.data || []} />
      </div>
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
