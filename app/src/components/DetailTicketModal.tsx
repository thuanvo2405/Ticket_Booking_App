import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  WideDialogContent,
} from "@/components/ui/dialog";
import { Clock9, MapPin } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { formatDateTime } from "@/utils/convert";

interface DetailTicketModalProps {
  qrCode: string;
  tenloaive: string;
  madonhang: string;
  mave: string;
  tensukien: string;
  diachi: string;
  phuong: string;
  quan: string;
  thanhpho: string;
  thoigianbatdau: string;
}

export default function DetailTicketModal({
  qrCode,
  tenloaive,
  madonhang,
  mave,
  tensukien,
  diachi,
  phuong,
  quan,
  thanhpho,
  thoigianbatdau,
}: DetailTicketModalProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="h-full">Xem Chi Tiết</Button>
        </DialogTrigger>
        <WideDialogContent className="w-[600px] min-h-580px">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-wide">
              Vé của bạn
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <h2 className="text-center font-semibold text-2xl py-2 uppercase">
              {tensukien}
            </h2>

            <div className="flex flex-col items-center gap-3">
              <div className="p-3 border rounded-xl shadow-sm bg-white">
                <QRCodeCanvas value={qrCode} size={180} />
              </div>
              <p className="text-xs text-gray-500 tracking-wide">{mave}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Mã đơn:</span> {madonhang}
              </p>
              <p>
                <span className="font-semibold">Loại vé:</span> {tenloaive}
              </p>
            </div>

            {/* Event info */}
            <div className="pt-4 border-t text-sm space-y-1">
              <p className="flex items-center font-semibold gap-2">
                <MapPin size={16} />
                {tensukien}
              </p>
              <p className="text-gray-600 pl-6">
                {diachi + ", " + phuong + ", " + quan + ", " + thanhpho}
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <span>
                  <Clock9 size={16} />
                </span>
                {formatDateTime(thoigianbatdau)}
              </p>
            </div>
          </div>
        </WideDialogContent>
      </form>
    </Dialog>
  );
}
