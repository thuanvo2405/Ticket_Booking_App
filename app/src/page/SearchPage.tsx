import { useEffect, useState } from "react";
import EventCard from "@/components/event-card";
import OptionPicker from "@/components/option-picker";
import TimePicker from "@/components/time-picker";
import { X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

interface FilterData {
  area?: string;
  type?: string;
  price?: number[];
}

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterData>({});
  const events = useSearchStore((state) => state.events);
  const searchEvents = useSearchStore((state) => state.searchEvents);

  useEffect(() => {
    searchEvents();
  }, []);

  const handleApplyFilter = (data: FilterData) => setFilters(data);

  const removeTag = (key: keyof FilterData) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <div className="w-[1284px] mx-auto">
      <div className="flex items-center py-3 justify-between">
        <p className="font-semibold">Kết quả tìm kiếm</p>
        <div className="gap-3">
          <TimePicker />
          <OptionPicker onApply={handleApplyFilter} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(filters).map(([key, value]) =>
          value ? (
            <div
              key={key}
              className="flex items-center bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {Array.isArray(value) ? `${value[0]}k` : value}
              <button
                className="ml-2 hover:text-red-500"
                onClick={() => removeTag(key as keyof FilterData)}
              >
                <X size={14} />
              </button>
            </div>
          ) : null
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {events?.map((item: any) => (
          <EventCard
            key={item.masukien}
            maSuKien={item.masukien}
            tenSuKien={item.tensukien}
            anhBanner={item.anhsukienngang}
            thoiGianBatDau={item?.suat_dien?.[0]?.thoigianbatdau}
            giaTien={item?.suat_dien?.[0]?.loaiVe?.[0].giaTien}
          />
        ))}
      </div>
    </div>
  );
}
