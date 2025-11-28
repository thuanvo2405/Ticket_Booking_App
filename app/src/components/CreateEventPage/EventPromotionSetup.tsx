import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import EventPromotionModal from "./EventPromotionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePromotionAPI,
  getPromotionAPI,
} from "@/services/promotionService";
import { useSearchParams } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { useEventStore } from "@/store/useEventStore";

type Promotion = {
  makhuyenmai: string;
  magiamgia: string;
  giatrigiam: number;
  loaigiam: "PHAN_TRAM" | "SO_TIEN";
  ngaybatdau: string;
  ngayketthuc: string;
  soluongphathanh: number;
  giatritoithieu: number;
};

export default function EventPromotionSetup() {
  const [searchParams] = useSearchParams();
  const maSuKien = searchParams.get("eventId");
  const { setPrevStep, setNextStep } = useEventStore();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["fetchPromotions", maSuKien],
    queryFn: () => getPromotionAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const handleDelete = useMutation({
    mutationFn: async (row: Promotion) => {
      await deletePromotionAPI(row.magiamgia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchPromotions", maSuKien],
      });
    },
  });

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "magiamgia",
      header: "Mã giảm giá",
    },
    {
      accessorKey: "loaigiam",
      header: "Loại giảm",
      cell: ({ row }) => {
        const x = row.original.loaigiam;
        return x === "PHAN_TRAM" ? "Phần trăm" : "Số tiền";
      },
    },
    {
      accessorKey: "giatrigiam",
      header: "Giá trị giảm",
      cell: ({ row }) =>
        row.original.loaigiam === "PHAN_TRAM"
          ? `${row.original.giatrigiam}%`
          : `${row.original.giatrigiam.toLocaleString()}đ`,
    },
    {
      accessorKey: "giatritoithieu",
      header: "Giá trị tối thiểu",
      cell: ({ row }) => `${row.original.giatritoithieu.toLocaleString()}đ`,
    },
    {
      accessorKey: "ngaybatdau",
      header: "Ngày bắt đầu",
      cell: ({ row }) =>
        new Date(row.original.ngaybatdau).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "ngayketthuc",
      header: "Ngày kết thúc",
      cell: ({ row }) =>
        new Date(row.original.ngayketthuc).toLocaleString("vi-VN"),
    },

    {
      accessorKey: "soluongphathanh",
      header: "SL phát hành",
    },

    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log("hi");
            }}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete.mutate(row.original)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-11/12 mx-auto p-4">
      <div className="flex items-center justify-between">
        <p className="text-xl">Quản lý khuyến mãi</p>
        <EventPromotionModal />
      </div>

      <div className="mt-4">
        <DataTable columns={columns} data={data || []} />
      </div>
      <div className="flex justify-between py-6 border-t mt-10">
        <Button onClick={() => setPrevStep()} className="w-32">
          Quay lại
        </Button>
        <Button onClick={() => setNextStep()} className="w-32">
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
