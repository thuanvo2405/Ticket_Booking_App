import { DataTable } from "@/components/data-table";
import DetailTicketModal from "@/components/DetailTicketModal";
import type { Item, Order } from "@/constant/types";
import { getOrderByIDAPI } from "@/services/orderService";
import { getTicketsByOrderIDAPI } from "@/services/ticketService";
import { formatPrice } from "@/utils/convert";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";

export type Ticket = {
  mave: string;
  qrcode: string;
  tenloaive: string;
};

export default function DetailOrderPage() {
  const { madonhang } = useParams();
  console.log(madonhang);
  const { data: orderData, isFetching: orderLoading } = useQuery<{
    order: Order;
    items: Item[];
  }>({
    queryKey: ["orderDetail", madonhang],
    queryFn: () => getOrderByIDAPI(madonhang!),
    enabled: !!madonhang,
  });
  const { data: ticketData, isFetching: ticketLoading } = useQuery({
    queryKey: ["fetchingTickets", madonhang],
    queryFn: () => getTicketsByOrderIDAPI(madonhang!),
    enabled: !!madonhang,
  });
  if (orderLoading && ticketLoading) return <h1>Loading</h1>;

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "mave",
      header: "Mã Vé",
    },
    {
      accessorKey: "tenloaive",
      header: "Tên loại vé",
    },
    {
      accessorKey: "qrcode",
      header: () => <div className="text-center">Hành động</div>,
      cell: ({ row }) => {
        const eventInfo = ticketData?.[0];
        return (
          <div className="flex items-center justify-center">
            <DetailTicketModal
              qrCode={row.getValue("qrcode")}
              tenloaive={row.original.tenloaive}
              madonhang={orderData?.order.madonhang || ""}
              mave={row.original.mave}
              tensukien={eventInfo?.tensukien || ""}
              diachi={eventInfo?.diachi || ""}
              phuong={eventInfo?.phuong || ""}
              quan={eventInfo?.quan || ""}
              thanhpho={eventInfo?.thanhpho || ""}
              thoigianbatdau={eventInfo?.thoigianbatdau || ""}
            />
          </div>
        );
      },
    },
  ];

  console.log(ticketData);
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        <p>
          <span className="font-semibold">
            Mã đơn hàng: {orderData?.order.madonhang}
          </span>
        </p>
        <p>
          <span className="font-semibold mr-2">Trạng thái:</span>
          <span className="text-green-600 font-semibold">
            {orderData?.order.trangthai === "DA_THANH_TOAN"
              ? "Đã thanh toán"
              : ""}
          </span>
        </p>
        <p>
          <span className="font-semibold">Tổng tiền: </span>
          {formatPrice(Number(orderData?.order.tongtien))}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <caption className="caption-top text-lg font-semibold mb-2">
            Danh sách các loại vé
          </caption>
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Tên loại vé
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Số lượng
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Giá
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData?.items.map((item) => (
              <tr className="border-t hover:bg-gray-50" key={item.maloaive}>
                <td className="px-4 py-2">{item.tenloaive}</td>
                <td className="px-4 py-2">{item.soluong}</td>
                <td className="px-4 py-2">
                  {formatPrice(Math.round(item.giatien))}
                </td>
                <td className="px-4 py-2">
                  {formatPrice(Math.round(item.thanhtien))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-lg font-semibold mb-4">Danh sách chi tiết loại vé</p>
        <DataTable columns={columns} data={ticketData || []} />
      </div>
    </div>
  );
}
