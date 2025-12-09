import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import EventPromotionModal from "./EventPromotionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePromotionAPI,
  getPromotionAPI,
} from "@/services/promotionService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { useEventStore } from "@/store/useEventStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { updateEventStatusAPI } from "@/services/eventService";
import toast from "react-hot-toast";
import { useState } from "react";

export type Promotion = {
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
  const navigate = useNavigate();
  const maSuKien = searchParams.get("eventId");
  const { setPrevStep } = useEventStore();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );

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

  const handleUpdateStatusEvent = useMutation({
    mutationFn: () => updateEventStatusAPI(maSuKien!, "CHO_DUYET"),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["fetchProfileEventByOrganizerID"],
        exact: false,
      });
      toast.success("Sự kiện đã được gửi yêu cầu duyệt!");
      navigate("/organizer/my-events");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
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
          : `${Number(row.original.giatrigiam).toLocaleString()}đ`,
    },
    {
      accessorKey: "giatritoithieu",
      header: "Giá trị tối thiểu",
      cell: ({ row }) =>
        `${Number(row.original.giatritoithieu).toLocaleString()}đ`,
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
            onClick={() => setEditingPromotion(row.original)}
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
        <EventPromotionModal
          promotion={editingPromotion}
          onClose={() => setEditingPromotion(null)}
        />
      </div>

      <div className="mt-4">
        <DataTable columns={columns} data={data || []} />
      </div>
      <div className="flex justify-between py-6 border-t mt-10">
        <Button onClick={() => setPrevStep()} className="w-32">
          Quay lại
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="" variant="outline">
              Yêu cầu duyệt sự kiện
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Yêu cầu duyệt sự kiện</AlertDialogTitle>
              <AlertDialogDescription>
                Khi sự kiện được yêu cầu duyệt, bạn sẽ không thể chỉnh sửa thông
                tin nữa. Vui lòng kiểm tra kỹ trước khi yêu cầu duyệt sự kiện.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleUpdateStatusEvent.mutate();
                }}
              >
                Đồng ý
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
