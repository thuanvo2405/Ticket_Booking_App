import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  formatDateTime,
  formatFullDateTime,
  formatPrice,
} from "@/utils/convert";

export default function TicketInfo({ suat_dien }: { suat_dien: any }) {
  console.log(suat_dien);
  console.log(suat_dien);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSession = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#222] text-white rounded-2xl shadow-xl overflow-hidden mt-10">
      <p className="text-lg font-semibold bg-[#1b1b1b] px-4 py-3 border-b border-gray-700">
        Thông tin vé
      </p>

      {suat_dien.map((item: any, index: number) => (
        <div key={index} className="border-b border-gray-700">
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#2a2a2a] transition"
            onClick={() => toggleSession(index)}
          >
            <div className="flex items-center gap-2">
              {activeIndex === index ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
              <span className="font-medium">
                {formatFullDateTime(item.thoigianbatdau, item.thoigianketthuc)}
              </span>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md">
              Mua vé ngay
            </button>
          </div>

          {activeIndex === index && (
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
      ))}
    </section>
  );
}
