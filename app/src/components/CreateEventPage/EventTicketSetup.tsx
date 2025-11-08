import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import MenuTicket from "./EventTicket/MenuTicket";
import CreateTicketModal from "./EventTicket/CreateTicketModal";
import { useState } from "react";
import CreatePerformance from "./EventTicket/CreatePerformance";

export default function EventTicketSetup() {
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [openCreatePerformance, setOpenCreatePerformance] = useState(false);

  const handleCloseCreatePerformance = () => {
    setOpenCreatePerformance(false);
  };

  return (
    <div>
      <div className="border-b-2 w-11/12 mx-auto py-3">
        <div className="text-2xl uppercase mb-3">Suất diễn</div>
        <div className="flex flex-col gap-3">
          <MenuTicket />
          <MenuTicket />
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
