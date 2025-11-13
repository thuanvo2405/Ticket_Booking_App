import { create } from "zustand";
import { getEventsAPI } from "@/services/eventService";
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
  setTenSuKien: (tenSuKien: string) => void;
  setEventType: (eventType: string) => void;
  setArea: (area: string) => void;
  setFromDate: (fromDate?: Date) => void;
  setToDate: (toDate?: Date) => void;
  searchEvents: () => Promise<void>;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  page: 1,
  limit: 12,
  tenSuKien: "",
  events: [],
  fromDate: undefined,
  toDate: undefined,
  eventType: "",
  area: "Toàn Quốc",

  setTenSuKien: (tenSuKien) => set({ tenSuKien }),
  setFromDate: (fromDate) => set({ fromDate }),
  setToDate: (toDate) => set({ toDate }),
  setEventType: (eventType) => set({ eventType }),
  setArea: (area) => set({ area }),
  searchEvents: async () => {
    const fromDate = get().fromDate;
    const toDate = get().toDate;

    try {
      const res = await getEventsAPI({
        page: get().page,
        limit: get().limit,
        tenSuKien: get().tenSuKien,
        trangThai: "DA_DUYET",
        from: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
        to: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      });

      set({ events: res.data });
    } catch (error) {
      console.error("Search failed:", error);
      set({ events: [] });
    }
  },
}));
