import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsAPI, updateEventStatusAPI } from "@/services/eventService";
import { useState } from "react";
import toast from "react-hot-toast";
import { EventProfileModal } from "@/components/AdminPage/EventProfileModal";
import type { ColumnDef } from "@tanstack/react-table";

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
  const limit = 5;

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["events", page],
    queryFn: () => getEventsAPI({ page, limit }),
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
        const colorMap: Record<string, string> = {
          CHO_DUYET: "text-yellow-600",
          DA_DUYET: "text-green-600",
          HUY: "text-red-600",
          TU_CHOI: "text-red-600",
          NHAP: "text-gray-500",
        };
        return (
          <span className={colorMap[value] || "text-black"}>
            {value.replaceAll("_", " ")}
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
        const showActions =
          event.trangthai === "NHAP" || event.trangthai === "CHO_DUYET";
        return (
          <div className="flex gap-2">
            <EventProfileModal event={event} />
            {showActions && (
              <>
                <Button onClick={() => handleAccept.mutate(event.masukien)}>
                  Duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject.mutate(event.masukien)}
                >
                  Từ chối
                </Button>
              </>
            )}
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
