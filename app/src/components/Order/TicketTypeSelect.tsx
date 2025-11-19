import { formatPrice } from "@/utils/convert";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTicketStore } from "@/store/useTicketStore";

export interface TicketTypeSelectProps {
  maLoaiVe: string;
  tenLoaiVe: string;
  giaTien: number;
  moTa?: string;
  soLuongPhatHanh: number;
  soLuongKhoa: number;
  soLuongDaBan: number;
}

export default function TicketTypeSelect({
  ticket,
}: {
  ticket: TicketTypeSelectProps;
}) {
  const [quantity, setQuantity] = useState(0);
  const [veConLai, setVeConLai] = useState(
    ticket.soLuongPhatHanh - ticket.soLuongKhoa - ticket.soLuongDaBan
  );
  const { addTicket, updateQuantity, removeTicket } = useTicketStore();
  const { selectedTickets } = useTicketStore();

  useEffect(() => {
    const exist = selectedTickets.find((t) => t.maLoaiVe === ticket.maLoaiVe);
    if (exist) setQuantity(exist.soLuong);
    else setQuantity(0);
  }, [selectedTickets, ticket.maLoaiVe]);

  const handleIncrease = () => {
    if (quantity >= veConLai) return;

    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    if (newQuantity === 1) {
      addTicket({
        maLoaiVe: ticket.maLoaiVe,
        tenLoaiVe: ticket.tenLoaiVe,
        giaTien: ticket.giaTien,
        soLuong: 1,
      });
    } else {
      updateQuantity(ticket.maLoaiVe, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity === 0) return;

    const newQuantity = quantity - 1;
    setQuantity(newQuantity);

    if (newQuantity === 0) {
      removeTicket(ticket.maLoaiVe);
    } else {
      updateQuantity(ticket.maLoaiVe, newQuantity);
    }
  };

  return (
    <div className=" border-b border-dashed py-4 my-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-green-500 uppercase font-semibold">
            {ticket.tenLoaiVe}
            <span className="ml-1 text-black text-xs">
              {veConLai > 0 ? `(Còn ${veConLai} vé)` : "(Hết vé)"}
            </span>
          </p>
          <p>{formatPrice(ticket.giaTien)}</p>
        </div>
        <div className="flex gap-1">
          <Button onClick={handleDecrease}>-</Button>
          <Input type="number" className="w-15 text-center" value={quantity} />
          <Button onClick={handleIncrease}>+</Button>
        </div>
      </div>
      {ticket.moTa && (
        <div className="text-sm text-gray-500 mt-2 overflow-hidden truncate bg-gray-100 p-2 rounded">
          <div dangerouslySetInnerHTML={{ __html: ticket.moTa || "" }}></div>
        </div>
      )}
    </div>
  );
}
