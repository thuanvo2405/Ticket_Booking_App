import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getCheckinStatsAPI } from "@/services/checkinService";
import CheckinOverviewCard from "@/components/CheckinOverviewCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import QRCheck from "@/components/QRCheck";

const MA_SUAT_DIEN = "b267f9fc-5c99-4353-abe1-11c625b2d76f";

export type LoaiVeStats = {
  maloaiVe: string;
  tenLoaiVe: string;
  gia: string;
  tongVe: number;
  daCheckin: number;
  tiLeCheckin: number;
};

export const columns: ColumnDef<LoaiVeStats>[] = [
  { accessorKey: "tenLoaiVe", header: "Loại vé" },
  {
    accessorKey: "gia",
    header: "Giá (VNĐ)",
    cell: ({ row }) => Number(row.original.gia).toLocaleString("vi-VN"),
  },
  { accessorKey: "tongVe", header: "Tổng vé" },
  { accessorKey: "daCheckin", header: "Đã check-in" },
  {
    accessorKey: "tiLeCheckin",
    header: "Tỉ lệ (%)",
    cell: ({ row }) => `${row.original.tiLeCheckin}%`,
  },
];

const CheckinPage = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["checkin-stats", MA_SUAT_DIEN],
    queryFn: () => getCheckinStatsAPI(MA_SUAT_DIEN),
  });

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-6">
      <Button onClick={() => setOpen(true)}>Check-in</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Check-in vé</DialogTitle>
          </DialogHeader>

          {open && (
            <QRCheck key={open ? "open" : "closed"} maSuatDien={MA_SUAT_DIEN} />
          )}
        </DialogContent>
      </Dialog>

      <CheckinOverviewCard
        tongVe={data.tongQuan.tongVe}
        daCheckin={data.tongQuan.daCheckin}
        tiLeCheckin={data.tongQuan.tiLeCheckin}
      />

      <DataTable columns={columns} data={data.theoLoaiVe} />
    </div>
  );
};

export default CheckinPage;
