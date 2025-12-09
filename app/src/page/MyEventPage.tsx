import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import { DataTable } from "@/components/data-table";
import { useAuth } from "@/context/AuthProvider";
import {
  deleteEventAPI,
  fetchProfileEventsByOrganizerID,
} from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMAGE_URL } from "@/constant/constant";

type OrganizerEvent = {
  masukien: string;
  tensukien: string;
  anhsukienngang: string | null;
  trangthai: string;
};

const STATUS_MAP: Record<string, string | undefined> = {
  all: undefined,
  wait: "CHO_DUYET",
  accept: "DA_DUYET",
  pending: "NHAP",
};

const PAGE_SIZE = 10;

export default function MyEventPage() {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const statusFilter = STATUS_MAP[tab];

  const {
    data: eventsResponse,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["fetchProfileEventByOrganizerID", tab, page],
    queryFn: () =>
      fetchProfileEventsByOrganizerID({
        trangThai: statusFilter,
        page,
        limit: PAGE_SIZE,
      }),
    enabled: user?.vaitro === "TO_CHUC",
    placeholderData: (prev) => prev,
  });

  const events = eventsResponse?.data ?? [];
  const total = eventsResponse?.total ?? 0;
  const hasNext = page * PAGE_SIZE < total;
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  const deleteMutation = useMutation({
    mutationFn: (maSuKien: string) => deleteEventAPI(maSuKien),
    onSuccess: () => {
      toast.success("Xóa sự kiện thành công");
      queryClient.invalidateQueries({
        queryKey: ["fetchProfileEventByOrganizerID"],
        exact: false,
      });
    },
    onError: () => {
      toast.error("Xóa sự kiện thất bại");
    },
  });

  const columns: ColumnDef<OrganizerEvent>[] = [
    {
      accessorKey: "anhsukienngang",
      header: "Ảnh sự kiện",
      cell: ({ row }) => {
        const src = row.getValue("anhsukienngang") as string | null;
        return src ? (
          <img
            src={IMAGE_URL + src}
            alt="Ảnh sự kiện"
            className="h-16 w-28 rounded-md object-cover border"
          />
        ) : (
          <div className="h-16 w-28 rounded-md border flex items-center justify-center text-xs text-gray-400">
            Không có ảnh
          </div>
        );
      },
    },
    {
      accessorKey: "tensukien",
      header: "Tên sự kiện",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("tensukien")}
        </div>
      ),
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
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const event = row.original;
        const isApproved = event.trangthai !== "NHAP";

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/organizer/my-events/${row.original.masukien}/stats`)
              }
            >
              Xem
            </Button>
            {!isApproved && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/organizer/create-event?eventId=${event.masukien}`
                    )
                  }
                >
                  Sửa
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(event.masukien)}
                  disabled={deleteMutation.isPending}
                >
                  Xóa
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <h1>Loading</h1>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-6">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="flex w-full items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            <Search className="ml-3 text-gray-500" size={18} />
            <Input
              placeholder="Tìm kiếm sự kiện"
              className="bg-transparent border-none focus-visible:ring-0 text-black placeholder:text-gray-500"
            />
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            Tìm kiếm
          </Button>
          {user?.vaitro === "TO_CHUC" ? (
            <Button className="bg-black text-white hover:bg-gray-800">
              <Link to="/organizer/create-event">Tạo Sự Kiện</Link>
            </Button>
          ) : (
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                toast.error("Bạn phải tạo hồ sơ tổ chức trước khi tạo sự kiện");
              }}
            >
              Tạo Sự Kiện
            </Button>
          )}
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
            setPage(1);
          }}
        >
          <TabsList className="bg-gray-100 rounded-xl">
            <TabsTrigger
              value="all"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Tất cả
            </TabsTrigger>

            <TabsTrigger
              value="wait"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Chờ duyệt
            </TabsTrigger>
            <TabsTrigger
              value="accept"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Đã duyệt
            </TabsTrigger>

            <TabsTrigger
              value="pending"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Nháp
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-semibold">Sự kiện của bạn</p>
          {isFetching && (
            <span className="text-sm text-gray-500">Đang tải dữ liệu...</span>
          )}
        </div>
        <DataTable columns={columns} data={events} />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-600">
            {total
              ? `Hiển thị ${showingFrom}-${showingTo} trên ${total} sự kiện`
              : "Không có sự kiện nào"}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <div>Trang {page}</div>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => (hasNext ? prev + 1 : prev))}
              disabled={!hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
