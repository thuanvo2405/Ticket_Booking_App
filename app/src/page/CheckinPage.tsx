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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { maSuatDien } = useParams<{ maSuatDien: string }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["checkin-stats", maSuatDien],
    queryFn: () => getCheckinStatsAPI(maSuatDien || ""),
  });

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(-1)} 
        >
          Quay về
        </Button>

        <Button onClick={() => setOpen(true)}>Check-in</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Check-in vé</DialogTitle>
          </DialogHeader>

          {open && maSuatDien && (
            <QRCheck
              key={open ? "open" : "closed"}
              maSuatDien={maSuatDien}
              onSuccess={() => refetch()}
            />
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
