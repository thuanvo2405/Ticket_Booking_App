import { ArrowLeft } from "lucide-react";
import TicketTypeSelect from "@/components/Order/TicketTypeSelect";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getTicketTypeByPerformanceIDAPI } from "@/services/ticketService";
import { formatFullDateTime, formatPrice } from "@/utils/convert";
import { useTicketStore } from "@/store/useTicketStore";
import { useEffect } from "react";

export default function SelectTicketPage() {
  const navigate = useNavigate();
  const { maSuatDien } = useParams<{ maSuatDien: string }>();
  const total = useTicketStore((state) => state.getTotalPrice());
  const selectedTickets = useTicketStore((state) => state.selectedTickets);
  const { data, isFetching } = useQuery({
    queryKey: ["ticketTypes", maSuatDien],
    queryFn: () => getTicketTypeByPerformanceIDAPI(maSuatDien!),
    enabled: !!maSuatDien,
  });

  const { clearTickets } = useTicketStore();

  useEffect(() => {
    clearTickets();
  }, [maSuatDien]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  console.log(total);
  return (
    <div className=" w-full grid grid-cols-[5fr_2fr] p-4">
      <div className="relative">
        <div className="relative">
          <Button
            onClick={() => navigate(-1)}
            className="flex gap-2 text-lg items-center font-semibold absolute left-4 cursor-pointer"
          >
            <ArrowLeft />
            Trở về
          </Button>
          <p className="text-xl font-semibold mx-auto text-center">Chọn vé</p>
        </div>
        <div className="w-3/4 mx-auto mt-10">
          <div className="flex justify-between text-xl font-semibold">
            <p>Loại vé</p>
            <p>Số lượng</p>
          </div>
          {data.suatdien.map((ticket: any, index: number) => (
            <TicketTypeSelect
              key={index}
              ticket={{
                maLoaiVe: ticket.maloaive,
                tenLoaiVe: ticket.tenloaive,
                giaTien: ticket.giatien,
                moTa: ticket.moTa,
                soLuongPhatHanh: ticket.soluongphathanh,
                soLuongKhoa: ticket.soluongkhoa,
                soLuongDaBan: ticket.soluongdaban,
              }}
            />
          ))}
        </div>
      </div>
      <div className="relavite">
        <div className="bg-white shadow-lg p-6 rounded-2xl flex flex-col sticky top-6 max-h-[80vh] w-full md:w-96">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {data.tensukien}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatFullDateTime(data.thoigianbatdau, data.thoigianketthuc)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {`${data.diachi}, ${data.phuong}, ${data.quan}, ${data.thanhpho}`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-6">
            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">
              Giá vé
            </h4>
            <div className="space-y-3">
              {data.suatdien.map((ticket: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-lg shadow-sm"
                >
                  <span className="text-gray-800 font-medium">
                    {ticket.tenloaive}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(ticket.giatien)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {total > 0 ? (
              <Button
                onClick={() => console.log(selectedTickets)}
                className="w-full bg-green-600 hover:bg-green-700 font-semibold py-3 rounded-lg shadow-md transition-all hover:scale-105"
              >
                Tiếp tục - {formatPrice(total)}
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-400 font-semibold py-3 rounded-lg shadow-md"
              >
                Vui lòng chọn vé
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
