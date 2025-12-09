import { create } from "zustand";
import { searchEventsForUserAPI } from "@/services/eventService";
import { format } from "date-fns";

interface SearchStore {
  page: number;
  limit: number;
  tenSuKien: string;
  events: any[];
  fromDate?: Date;
  toDate?: Date;
  eventType: string;
  area: string;
  total: number;

  setTenSuKien: (tenSuKien: string) => void;
  setLimit: (limit: number) => void;
  setEventType: (eventType: string) => void;
  setArea: (area: string) => void;
  setFromDate: (fromDate?: Date) => void;
  setToDate: (toDate?: Date) => void;
  setPage: (page: number) => void;
  searchEvents: () => Promise<void>;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  page: 1,
  limit: 12,
  tenSuKien: "",
  events: [],
  fromDate: undefined,
  toDate: undefined,
  eventType: "",
  area: "Toàn quốc",
  total: 0,

  setTenSuKien: (tenSuKien) => set({ tenSuKien }),
  setLimit: (limit) => set({ limit }),
  setEventType: (eventType) => set({ eventType }),
  setArea: (area) => set({ area }),
  setFromDate: (fromDate) => set({ fromDate }),
  setToDate: (toDate) => set({ toDate }),
  setPage: (page) => set({ page }),

  resetFilters: () =>
    set({
      tenSuKien: "",
      eventType: "",
      area: "Toàn quốc",
      fromDate: undefined,
      toDate: undefined,
      page: 1,
    }),

  searchEvents: async () => {
    try {
      const res = await searchEventsForUserAPI({
        page: get().page,
        limit: get().limit,
        tenSuKien: get().tenSuKien || undefined,
        khuVuc: get().area !== "Toàn quốc" ? get().area : undefined,
        tenLoaiSuKien: get().eventType || undefined,
        from: get().fromDate
          ? format(get().fromDate as Date, "yyyy-MM-dd")
          : undefined,
        to: get().toDate
          ? format(get().toDate as Date, "yyyy-MM-dd")
          : undefined,
      });

      set({
        events: res.data,
        total: res.total,
      });
    } catch (error) {
      console.error("Search events failed:", error);
      set({ events: [], total: 0 });
    }
  },
}));
