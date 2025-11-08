import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EventData {
  // fields form tạo sự kiện
}

export interface TicketTypes {
  // fields vé
}

export interface PromotionData {
  // fields khuyến mãi
}

type Store = {
  step: number;
  eventID: number | null;
  eventData: EventData | null;
  ticketTypes: TicketTypes[];
  promotions: PromotionData[];

  setStep: (step: number) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setEventID: (id: number) => void;
  setEventData: (data: EventData) => void;
  addTicketType: (ticket: TicketTypes) => void;
  addPromotion: (promotion: PromotionData) => void;
  resetAll: () => void;
};

export const useEventStore = create<Store>()(
  persist(
    (set) => ({
      step: 1,
      eventID: null,
      eventData: null,
      ticketTypes: [],
      promotions: [],

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
      setEventData: (data) => set({ eventData: data }),
      addTicketType: (ticket) =>
        set((state) => ({ ticketTypes: [...state.ticketTypes, ticket] })),
      addPromotion: (promotion) =>
        set((state) => ({ promotions: [...state.promotions, promotion] })),

      resetAll: () =>
        set({
          step: 1,
          eventID: null,
          eventData: null,
          ticketTypes: [],
          promotions: [],
        }),
    }),
    { name: "create-event-flow" } // key localStorage để khôi phục sau reload
  )
);
