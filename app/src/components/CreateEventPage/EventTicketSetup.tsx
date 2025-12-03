import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import MenuTicket from "./EventTicket/MenuTicket";
import { useState } from "react";
import CreatePerformance from "./EventTicket/CreatePerformance";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getPerformaneAPI, getTicketTypeAPI } from "@/services/ticketService";
import { useSearchParams } from "react-router-dom";
import { useEventStore } from "@/store/useEventStore";
import toast from "react-hot-toast";

export default function EventTicketSetup() {
  const [searchParams] = useSearchParams();
  const [openCreatePerformance, setOpenCreatePerformance] = useState(false);
  const { setPrevStep, setNextStep } = useEventStore();
  const maSuKien = searchParams.get("eventId");
  const handleCloseCreatePerformance = () => {
    setOpenCreatePerformance(false);
  };

  const { data } = useQuery({
    queryKey: ["fetchPerformance", maSuKien],
    queryFn: () => getPerformaneAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const ticketTypeQueries = useQueries({
    queries:
      data?.map((item: any) => ({
        queryKey: ["fetchTicketType", item.masuatdien],
        queryFn: () => getTicketTypeAPI(item.masuatdien),
        enabled: !!item.masuatdien,
      })) || [],
  });

  const handleNext = () => {
    if (!data || data.length === 0) {
      toast.error("Phải có ít nhất 1 suất diễn");
      return;
    }

    const isLoadingTickets = ticketTypeQueries.some((q) => q.isLoading);

    if (isLoadingTickets) {
      toast.loading("Đang kiểm tra loại vé...");
      return;
    }

    const hasPerformanceWithoutTicket = ticketTypeQueries.some(
      (q) => !Array.isArray(q.data) || q.data.length === 0
    );

    if (hasPerformanceWithoutTicket) {
      toast.error("Mỗi suất diễn phải có ít nhất 1 loại vé");
      return;
    }

    setNextStep();
  };
  return (
    <div>
      <div className="border-b-2 w-11/12 mx-auto py-3">
        <div className="text-2xl uppercase mb-3">Suất diễn</div>
        <div className="flex flex-col gap-3">
          {maSuKien &&
            data?.map((item: any) => (
              <MenuTicket
                key={item.masuatdien}
                thoiGianBatDau={item.thoigianbatdau}
                thoiGianKetThuc={item.thoigianketthuc}
                masuatdien={item.masuatdien}
              />
            ))}
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center my-3">
        <Button
          variant="ghost"
          size="lg"
          className="text-green-500 text-xl mb-3"
          onClick={() => setOpenCreatePerformance((prev) => !prev)}
        >
          <Plus />
          Tạo suất diễn
        </Button>
        {openCreatePerformance && (
          <CreatePerformance close={handleCloseCreatePerformance} />
        )}
      </div>
      <div className="w-11/12  mx-auto flex justify-between py-6 border-t mt-10">
        <Button onClick={() => setPrevStep()} className="w-32">
          Quay lại
        </Button>
        <Button onClick={handleNext} className="w-32">
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
