import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  WideDialogContent,
} from "@/components/ui/dialog";
import { IMAGE_URL } from "@/constant/constant";
import { useState } from "react";
import { formatFullDateTime, formatPrice } from "@/utils/convert";

type EventProfileModalProps = {
  event: any;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  disableActions?: boolean;
};

export function EventProfileModal({
  event,
  onApprove,
  onReject,
  disableActions,
}: EventProfileModalProps) {
  const [expand, setExpand] = useState(false);
  const showtimes = event?.suat_dien || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Xem</Button>
      </DialogTrigger>
      <WideDialogContent className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-2xl font-bold">
            Thông tin sự kiện
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 w-full">
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Thông tin cơ bản
            </h2>
            <div className="flex flex-col gap-x-8 gap-y-4">
              <div className="grid grid-cols-[1fr_5fr]">
                <span className="font-bold">Tên sự kiện:</span>
                {event.tensukien}
              </div>
              <div className="grid grid-cols-[1fr_5fr]">
                <span className="font-bold">Loại sự kiện:</span>
                {event.tenloaisukien}
              </div>
              <div className="grid grid-cols-[1fr_5fr]">
                <span className="font-bold">Tên tổ chức:</span>
                {event.tentochuc}
              </div>

              <div className="col-span-2">
                <span className="font-bold">Địa chỉ:</span>{" "}
                {`${event.diachi}, ${event.phuong}, ${event.quan}, ${event.thanhpho}`}
              </div>
              <div className="col-span-2">
                <span className="font-bold">Mô tả:</span>
                <div
                  className={`
      prose max-w-none overflow-hidden transition-all duration-300
      ${expand ? "max-h-full" : "max-h-40"}
    `}
                  dangerouslySetInnerHTML={{ __html: event.mota }}
                />
                <button
                  type="button"
                  className="text-blue-600 mt-2 hover:underline"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Truyền thông & hình ảnh
            </h2>

            <div className="flex flex-wrap gap-8 justify-start items-start">
              <div className="flex flex-col items-center">
                <img
                  src={IMAGE_URL + event.anhsukienngang}
                  alt="Ảnh ngang sự kiện"
                  className="w-[500px] h-[280px] object-cover rounded-lg shadow"
                />
                <span className="text-sm mt-2 text-gray-600">Ảnh ngang</span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={IMAGE_URL + event.anhsukiendoc}
                  alt="Ảnh dọc sự kiện"
                  className="w-[260px] h-[400px] object-cover rounded-lg shadow"
                />
                <span className="text-sm mt-2 text-gray-600">Ảnh dọc</span>
              </div>
            </div>
          </section>

          {showtimes.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Lịch diễn & loại vé
              </h2>
              <div className="space-y-3">
                {showtimes.map((st: any) => (
                  <div
                    key={st.maSuatDien}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {formatFullDateTime(
                          st.thoigianbatdau,
                          st.thoigianketthuc
                        )}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      {st.loaiVe?.map((ticket: any) => (
                        <div
                          key={ticket.maLoaiVe}
                          className="flex justify-between rounded-md bg-white px-3 py-2"
                        >
                          <span>{ticket.tenLoaiVe}</span>
                          <span className="font-semibold text-green-600">
                            {formatPrice(ticket.giaTien)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-between flex-wrap gap-2">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <div className="flex gap-2">
            {onReject && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onReject(event.masukien)}
                disabled={disableActions}
              >
                Từ chối
              </Button>
            )}
            {onApprove && (
              <Button
                type="button"
                onClick={() => onApprove(event.masukien)}
                disabled={disableActions}
              >
                Duyệt
              </Button>
            )}
          </div>
        </DialogFooter>
      </WideDialogContent>
    </Dialog>
  );
}
