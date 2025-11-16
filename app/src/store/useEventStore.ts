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

export interface TicketTypes {
  // fields vé
}

export interface PromotionData {
  // fields khuyến mãi
}

type EventStore = {
  step: number;
  eventID: number | null;
  eventData: EventData | null;
  ticketTypes: TicketTypes[];
  promotions: PromotionData[];
  eventTypes: EventType[];

  setStep: (step: number) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setEventID: (id: number) => void;
  setEventData: (data: EventData) => void;
  addTicketType: (ticket: TicketTypes) => void;
  addPromotion: (promotion: PromotionData) => void;
  setEventTypes: (types: EventType[]) => void;
  fetchEventTypes: () => Promise<void>;
  resetAll: () => void;
};

export const useEventStore = create<EventStore>()((set) => ({
  step: 1,
  eventID: null,
  eventData: null,
  ticketTypes: [],
  promotions: [],
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
  setEventID: (id) => set({ eventID: id }),
  setEventData: (data) =>
    set((state) => ({
      eventData: {
        ...state.eventData,
        ...data,
      },
    })),
  addTicketType: (ticket) =>
    set((state) => ({ ticketTypes: [...state.ticketTypes, ticket] })),
  addPromotion: (promotion) =>
    set((state) => ({ promotions: [...state.promotions, promotion] })),
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
      eventID: null,
      eventData: null,
      ticketTypes: [],
      promotions: [],
    }),
}));
