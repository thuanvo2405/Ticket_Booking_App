import { IMAGE_URL } from "@/constant/constant";
import { Calendar } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils/convert";

export interface EventCardProps {
  maSuKien: string;
  tenSuKien: string;
  anhBanner: string;
  thoiGianBatDau: string;
  giaTien: number;
  trangthai?: string;
}

export default function EventCard({
  maSuKien,
  tenSuKien,
  anhBanner,
  thoiGianBatDau,
  giaTien,
  trangthai,
}: EventCardProps) {
  const isFinished = trangthai === "DA_DIEN_RA";

  return (
    <a
      href={`/event?maSuKien=${maSuKien}`}
      className="block rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative">
        <img
          src={IMAGE_URL + anhBanner}
          alt=""
          className="w-full h-[200px] object-cover"
        />

        {isFinished && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
            Đã diễn ra
          </span>
        )}
      </div>
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
    </a>
  );
}
