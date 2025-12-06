import { forwardRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatFullDateTime, formatPrice } from "@/utils/convert";
import { NavLink } from "react-router-dom";

const TicketInfo = forwardRef<
  HTMLDivElement,
  {
    suat_dien: any;
    maSuKien: string;
  }
>(({ suat_dien, maSuKien }, ref) => {
  console.log(suat_dien);

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  console.log(activeIndex);
  const toggleSession = (index: string) => {
    console.log("má" + index);
    setActiveIndex(activeIndex === index ? null : index);
  };

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
                {formatFullDateTime(item.thoigianbatdau, item.thoigianketthuc)}
              </span>
            </div>
            <NavLink
              to={`${maSuKien}/${item.maSuatDien}/selected`}
              className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md ${
                isExpired ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => {
                if (isExpired) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              aria-disabled={isExpired}
            >
              {isExpired ? "Đã hết hạn" : "Mua vé ngay"}
            </NavLink>
          </div>

          {activeIndex === item.maSuatDien && (
            <div className="bg-[#2b2b2b] divide-y divide-gray-700">
              {item.loaiVe?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-6 py-3 text-gray-200 hover:bg-[#333] transition"
                >
                  <span className="font-semibold">{item.tenLoaiVe}</span>
                  <span className="text-green-500 font-medium">
                    {formatPrice(item.giaTien)}
                  </span>
                </div>
              ))}
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
