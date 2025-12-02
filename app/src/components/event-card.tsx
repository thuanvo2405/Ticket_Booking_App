import { NavLink } from "react-router-dom";
import { IMAGE_URL } from "@/constant/constant";
import { Calendar } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils/convert";

export interface EventCardProps {
  maSuKien: string;
  tenSuKien: string;
  anhBanner: string;
  thoiGianBatDau: string;
  giaTien: number;
}

export default function EventCard({
  maSuKien,
  tenSuKien,
  anhBanner,
  thoiGianBatDau,
  giaTien,
}: EventCardProps) {
  return (
    <NavLink
      to={`/event?maSuKien=${maSuKien}`}
      className="block rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <img
        src={IMAGE_URL + anhBanner}
        alt=""
        className="w-full h-[200px] object-cover"
      />
      <div className="p-3">
        <p className="font-semibold line-clamp-2 my-1">{tenSuKien}</p>
        <p className="text-green-600 my-2 font-semibold">
          Từ {formatPrice(Number(giaTien))}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar />
          {formatDateTime(thoiGianBatDau)}
        </div>
      </div>
    </NavLink>
  );
}
