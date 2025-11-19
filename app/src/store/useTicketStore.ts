import { create } from "zustand";

interface SelectedTicket {
  maLoaiVe: string;
  tenLoaiVe: string;
  giaTien: number;
  soLuong: number;
}

interface TicketStore {
  selectedTickets: SelectedTicket[];
  addTicket: (ticket: SelectedTicket) => void;
  removeTicket: (maLoaiVe: string) => void;
  updateQuantity: (maLoaiVe: string, soLuong: number) => void;
  clearTickets: () => void;
  getTotalPrice: () => number;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  selectedTickets: [],
  addTicket: (ticket) =>
    set((state) => {
      const exist = state.selectedTickets.find(
        (t) => t.maLoaiVe === ticket.maLoaiVe
      );
      if (exist) {
        return {
          selectedTickets: state.selectedTickets.map((t) =>
            t.maLoaiVe === ticket.maLoaiVe
              ? { ...t, soLuong: t.soLuong + ticket.soLuong }
              : t
          ),
        };
      } else {
        return { selectedTickets: [...state.selectedTickets, ticket] };
      }
    }),
  removeTicket: (maLoaiVe) =>
    set((state) => ({
      selectedTickets: state.selectedTickets.filter(
        (t) => t.maLoaiVe !== maLoaiVe
      ),
    })),
  updateQuantity: (maLoaiVe, soLuong) =>
    set((state) => ({
      selectedTickets: state.selectedTickets.map((t) =>
        t.maLoaiVe === maLoaiVe ? { ...t, soLuong } : t
      ),
    })),
  clearTickets: () => set({ selectedTickets: [] }),
  getTotalPrice: () => {
    const { selectedTickets } = get();
    return selectedTickets.reduce((sum, t) => sum + t.giaTien * t.soLuong, 0);
  },
}));
