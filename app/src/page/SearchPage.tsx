import { useEffect, useState } from "react";
import EventCard from "@/components/event-card";
import OptionPicker from "@/components/option-picker";
import TimePicker from "@/components/time-picker";
import { SearchX, X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

interface FilterData {
  area?: string;
  type?: string;
  price?: number[];
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterData>({});
  const events = useSearchStore((state) => state.events);
  const searchEvents = useSearchStore((state) => state.searchEvents);

  const area = useSearchStore((state) => state.area);
  const eventType = useSearchStore((state) => state.eventType);
  const fromDate = useSearchStore((state) => state.fromDate);
  const toDate = useSearchStore((state) => state.toDate);
  const page = useSearchStore((state) => state.page);

  useEffect(() => {
    const nextFilters: FilterData = {};
    if (area && area !== "Toàn quốc") nextFilters.area = area;
    if (eventType) nextFilters.type = eventType;
    setFilters(nextFilters);
  }, [area, eventType]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    if (params.area) useSearchStore.getState().setArea(params.area);
    if (params.type) useSearchStore.getState().setEventType(params.type);
    if (params.from)
      useSearchStore.getState().setFromDate(new Date(params.from));
    if (params.to) useSearchStore.getState().setToDate(new Date(params.to));
    if (params.page) useSearchStore.getState().setPage(Number(params.page));
  }, []);

  useEffect(() => {
    const params: any = {};

    if (area !== "Toàn quốc") params.area = area;
    if (eventType) params.type = eventType;
    if (fromDate) params.from = format(fromDate, "yyyy-MM-dd");
    if (toDate) params.to = format(toDate, "yyyy-MM-dd");
    if (page) params.page = String(page);

    setSearchParams(params);
  }, [area, eventType, fromDate, toDate, page]);

  useEffect(() => {
    searchEvents();
  }, [area, eventType, fromDate, toDate, page]);

  const handleApplyFilter = (data: FilterData) => setFilters(data);

  const removeTag = (key: keyof FilterData) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];

      if (key === "area") useSearchStore.getState().setArea("Toàn quốc");
      if (key === "type") useSearchStore.getState().setEventType("");
      return newFilters;
    });
  };

  return (
    <div className="w-[1284px] mx-auto">
      <div className="flex items-center py-3 justify-between">
        <p className="font-semibold">Kết quả tìm kiếm</p>
        <div className="flex gap-3">
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

      {!events || events.length === 0 ? (
        <div className="w-full h-[400px] flex flex-col items-center justify-center py-20 text-gray-500">
          <SearchX className="w-24 h-24 mb-3" />
          <p className="text-xl font-medium">Không có sự kiện phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {events.map((item: any) => (
            <EventCard
              key={item.masukien}
              maSuKien={item.masukien}
              tenSuKien={item.tensukien}
              anhBanner={item.anhsukienngang}
              thoiGianBatDau={item?.suat_dien?.[0]?.thoigianbatdau}
              giaTien={item?.suat_dien?.[0]?.loaiVe?.[0].giaTien}
              trangthai={item.trangthai}
            />
          ))}
        </div>
      )}
    </div>
  );
}
