import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import MenuTicket from "./EventTicket/MenuTicket";
import CreateTicketModal from "./EventTicket/CreateTicketModal";
import { useState } from "react";
import CreatePerformance from "./EventTicket/CreatePerformance";
import { useQuery } from "@tanstack/react-query";
import { getPerformaneAPI } from "@/services/ticketService";
import { useEventStore } from "@/store/useEventStore";

export default function EventTicketSetup() {
  const { eventID } = useEventStore();
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [openCreatePerformance, setOpenCreatePerformance] = useState(false);
  const handleCloseCreatePerformance = () => {
    setOpenCreatePerformance(false);
  };

  const { data } = useQuery({
    queryKey: ["fetchPerformance", eventID],
    queryFn: () => getPerformaneAPI(eventID!),
    enabled: !!eventID,
  });
  console.log(data);

  return (
    <div>
      <div className="border-b-2 w-11/12 mx-auto py-3">
        <div className="text-2xl uppercase mb-3">Suất diễn</div>
        <div className="flex flex-col gap-3">
          {eventID &&
            data?.map((item: any, index: number) => (
              <MenuTicket
                key={index}
                thoiGianBatDau={item.thoigianbatdau}
                thoiGianKetThuc={item.thoigianketthuc}
                masuatdien={item.masuatdien}
              />
            ))}
          <Button
            variant="ghost"
            size="default"
            className="text-green-500 hover:bg-foreground/5 text-lg"
            onClick={() => setOpenCreateTicket((prev) => !prev)}
          >
            <Plus />
            Tạo loại vé
          </Button>
          {openCreateTicket && <CreateTicketModal />}
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center my-3">
        <Button
          variant="ghost"
          size="lg"
          className="text-green-500 text-xl"
          onClick={() => setOpenCreatePerformance((prev) => !prev)}
        >
          <Plus />
          Tạo suất diễn
        </Button>
        {openCreatePerformance && (
          <CreatePerformance close={handleCloseCreatePerformance} />
        )}
      </div>
    </div>
  );
}
