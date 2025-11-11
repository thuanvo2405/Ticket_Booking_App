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

export interface EventProfileModalProps {
  maSuKien: number;
  tenSuKien: string;
  mota: string;
  trangThai: string;
  tenToChuc: string;
  tenLoaiSuKien: string;
}

export function EventProfileModal({ event }: any) {
  console.log(event);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">Xem</Button>
        </DialogTrigger>
        <WideDialogContent className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-2xl font-bold">
              Thông tin sự kiện
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 w-[800px]">
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
                <div className="grid grid-cols-[1fr_5fr]">
                  <span className="font-bold">Trạng thái:</span>
                  {event.trangthai.replaceAll("_", " ")}
                </div>
                <div className="col-span-2">
                  <span className="font-bold">Mô tả:</span>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: event.mota_sukien }}
                  />
                </div>
              </div>
            </section>

            {/* 2. Thời gian & địa điểm */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Thời gian & địa điểm
              </h2>
              <div className="flex flex-col gap-x-8 gap-y-4">
                <div className="grid grid-cols-[3fr_8fr]">
                  <span className="font-bold">Ngày bắt đầu:</span>{" "}
                  {event.ngaybatdau}
                </div>
                <div className="grid grid-cols-[3fr_8fr]">
                  <span className="font-bold">Ngày kết thúc:</span>{" "}
                  {event.ngayketthuc}
                </div>
                <div className="col-span-2">
                  <span className="font-bold">Địa chỉ:</span>{" "}
                  {`${event.diaChi}, ${event.phuong}, ${event.quan}, ${event.thanhPho}`}
                </div>
              </div>
            </section>

            {/* 3. Truyền thông & hình ảnh */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Truyền thông & hình ảnh
              </h2>
              <div className="flex flex-wrap gap-6">
                {event.anhSuKienNgang && (
                  <img
                    src={event.anhSuKienNgang}
                    alt="Ảnh ngang sự kiện"
                    className="w-64 h-44 object-cover rounded-md shadow"
                  />
                )}
                {event.anhSuKienDoc && (
                  <img
                    src={event.anhSuKienDoc}
                    alt="Ảnh dọc sự kiện"
                    className="w-44 h-64 object-cover rounded-md shadow"
                  />
                )}
              </div>
            </section>

            {/* 4. Thông tin bán vé / đăng ký */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Thông tin bán vé / đăng ký
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="font-bold">Loại vé:</span> {event.loaiVe}
                </div>
                <div>
                  <span className="font-bold">Giá vé:</span> {event.giaVe}
                </div>
                <div>
                  <span className="font-bold">Số lượng vé:</span>{" "}
                  {event.soLuongVe}
                </div>
                <div className="col-span-2">
                  <span className="font-bold">Khuyến mãi:</span>{" "}
                  {event.khuyenMai || "Không có"}
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="mt-6 flex justify-between flex-wrap gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button type="submit" variant="destructive">
                Từ chối
              </Button>
              <Button type="submit">Duyệt</Button>
            </div>
          </DialogFooter>
        </WideDialogContent>
      </form>
    </Dialog>
  );
}
