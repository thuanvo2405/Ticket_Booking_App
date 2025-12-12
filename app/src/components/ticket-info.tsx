import { forwardRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatFullDateTime, formatPrice } from "@/utils/convert";
import { NavLink } from "react-router-dom";

const TicketInfo = forwardRef<
  HTMLDivElement,
  {
    suat_dien: any;
    maSuKien: string;
    isLoggedIn: boolean;
    onRequireLogin: () => void;
  }
>(({ suat_dien, maSuKien, isLoggedIn, onRequireLogin }, ref) => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const toggleSession = (index: string) =>
    setActiveIndex((prev) => (prev === index ? null : index));

  return (
    <section
      ref={ref}
      className="bg-[#222] text-white rounded-2xl shadow-xl overflow-hidden mt-10"
    >
      <p className="text-lg font-semibold bg-[#1b1b1b] px-4 py-3 border-b border-gray-700">
        Thông tin vé
      </p>

      {suat_dien.map((item: any) => {
        const now = new Date();
        const end = item.thoigianketthuc
          ? new Date(item.thoigianketthuc)
          : null;
        const isExpired = end ? end < now : false;
        const tickets = item.loaiVe || [];
        const allTicketsSoldOut = tickets.every(
          (ticket: any) => (ticket.soLuongConLai ?? 0) <= 0
        );

        return (
          <div key={item.maSuatDien} className="border-b border-gray-700">
            <div
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#2a2a2a] transition"
              onClick={() => toggleSession(item.maSuatDien)}
            >
              <div className="flex items-center gap-2">
                {activeIndex === item.maSuatDien ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <span className="font-medium">
                  {formatFullDateTime(
                    item.thoigianbatdau,
                    item.thoigianketthuc
                  )}
                </span>
                {allTicketsSoldOut && (
                  <span className="ml-2 rounded-full bg-red-600/80 px-3 py-1 text-xs font-semibold">
                    Suất diễn hết vé
                  </span>
                )}
              </div>
              <NavLink
                to={`${maSuKien}/${item.maSuatDien}/selected`}
                className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md ${
                  isExpired || allTicketsSoldOut
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e) => {
                  if (isExpired || allTicketsSoldOut) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }

                  if (!isLoggedIn) {
                    e.preventDefault();
                    e.stopPropagation();
                    onRequireLogin();
                  }
                }}
                aria-disabled={isExpired || allTicketsSoldOut}
              >
                {isExpired
                  ? "Đã hết hạn"
                  : allTicketsSoldOut
                  ? "Hết vé"
                  : "Mua vé ngay"}
              </NavLink>
            </div>

            {activeIndex === item.maSuatDien && (
              <div className="bg-[#2b2b2b] divide-y divide-gray-700">
                {tickets.map((ticket: any, idx: number) => {
                  const remaining = ticket.soLuongConLai ?? 0;
                  const soldOut = remaining <= 0;
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-6 py-3 text-gray-200 hover:bg-[#333] transition"
                    >
                      <span className="font-semibold">{ticket.tenLoaiVe}</span>
                      <div className="flex items-center gap-3">
                        {soldOut && (
                          <span className="rounded-full bg-red-600/80 px-3 py-1 text-xs font-semibold">
                            Hết vé
                          </span>
                        )}
                        <span
                          className={`font-medium ${
                            soldOut ? "text-gray-400" : "text-green-500"
                          }`}
                        >
                          {formatPrice(ticket.giaTien)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
});

TicketInfo.displayName = "TicketInfo";

export default TicketInfo;
