import { getEventTypesAPI } from "@/services/eventService";
import { create } from "zustand";

export interface EventData {
  tenSuKien: string;
  maloaisukien: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  soNha: string;
  moTa?: string;
  posterFile?: File;
  bannerFile?: File;
  posterUrl?: string;
  bannerUrl?: string;
}

export interface EventType {
  maloaisukien: string;
  tenloaisukien: string;
}

type EventStore = {
  step: number;
  maSuKien: string | null;
  eventData: EventData | null;
  eventTypes: EventType[];

  setStep: (step: number) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setMaSuKien: (id: string) => void;
  setEventData: (data: EventData) => void;
  setEventTypes: (types: EventType[]) => void;
  fetchEventTypes: () => Promise<void>;
  resetAll: () => void;
};

export const useEventStore = create<EventStore>()((set) => ({
  step: 1,
  maSuKien: null,
  eventData: null,
  eventTypes: [],

  setStep: (step) => set({ step }),
  setNextStep: () =>
    set((state) => ({
      step: state.step < 4 ? state.step + 1 : state.step,
    })),
  setPrevStep: () =>
    set((state) => ({
      step: state.step > 1 ? state.step - 1 : state.step,
    })),
  setMaSuKien: (id) => set({ maSuKien: id }),
  setEventData: (data) =>
    set((state) => ({
      eventData: {
        ...state.eventData,
        ...data,
      },
    })),
  setEventTypes: (types) => set({ eventTypes: types }),
  fetchEventTypes: async () => {
    try {
      const types = await getEventTypesAPI();
      set({ eventTypes: types });
    } catch (err) {
      console.error("Không tải được loại sự kiện", err);
    }
  },

  resetAll: () =>
    set({
      step: 1,
      maSuKien: null,
      eventData: null,
    }),
}));
