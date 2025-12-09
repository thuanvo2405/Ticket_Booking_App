import TicketDescription from "@/components/ui/ticket-description";
import {
  getEventByIdAPI,
  getMaybeLikeEventsAPI,
} from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { IMAGE_URL } from "@/constant/constant";
import { formatPrice } from "@/utils/convert";
import TicketInfo from "@/components/ticket-info";
import EventCard from "@/components/event-card";
import { useRef } from "react";

export default function EventPage() {
  const ticketInfoRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const maSuKien = searchParams.get("maSuKien") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["fetchingEventById", maSuKien],
    queryFn: () => getEventByIdAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const { data: suggestEvent, isFetching: fetchingSuggetEvent } = useQuery({
    queryKey: ["fetchingSuggestEvent"],
    queryFn: getMaybeLikeEventsAPI,
  });

  if (isLoading || fetchingSuggetEvent) return <h1>Loading</h1>;

  return (
    <div className="w-[1284px] mx-auto mt-4">
      <div className="flex bg-gray-900 text-white rounded-3xl overflow-hidden mx-auto shadow-xl">
        <div className="w-2/5 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold leading-snug">
              {data.tensukien}
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-2 text-green-400">
                📅 17:30 - 19:30, 01 Tháng 11, 2025
              </p>
              {data.suat_dien.length > 1 && (
                <p className="text-gray-300">
                  + {data.suat_dien.length - 1} ngày khác
                </p>
              )}

              <p className="flex items-start gap-2 text-gray-200">
                📍
                <span>
                  {data.diachi +
                    ", " +
                    data.phuong +
                    ", " +
                    data.quan +
                    ", " +
                    data.thanhpho}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-700 pt-6">
            <p className="text-lg">
              Giá từ
              <span className="text-green-400 font-semibold text-xl ml-2">
                {formatPrice(data.suat_dien[0].loaiVe[0].giaTien)}
              </span>
            </p>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              onClick={() =>
                ticketInfoRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Chọn lịch diễn
            </button>
          </div>
        </div>

        <div
          className="w-3/5 h-80 md:h-auto bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGE_URL + data.anhsukienngang})`,
          }}
        ></div>
      </div>
      <section>
        <TicketDescription moTa={data.mota} />
        <TicketInfo
          ref={ticketInfoRef}
          suat_dien={data.suat_dien}
          maSuKien={maSuKien}
        />
        <div className="shadow-xl border mt-10 rounded-2xl p-4">
          <p className="text-xl font-semibold text-center border-b-1 py-3">
            Ban tổ chức
          </p>
          <div className="flex gap-3 mt-2">
            <img
              src={IMAGE_URL + data.anhtochuc}
              alt={`Ảnh tổ chức` + data.tentochuc}
              className="w-50 object-cover"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">{data.tentochuc}</p>
              <p>{data.mota_tochuc}</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="shadow-xl border mt-10 rounded-2xl p-4">
        <p className="text-xl font-semibold text-center py-3">
          Có thể bạn thích
        </p>
        <div className="grid grid-cols-4 gap-4">
          {suggestEvent.map((item: any) => (
            <EventCard
              key={item.masukien}
              maSuKien={item.masukien}
              tenSuKien={item.tensukien}
              anhBanner={item.anhsukienngang}
              thoiGianBatDau={item.suat_dien}
              giaTien={Number(item.gia)}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
