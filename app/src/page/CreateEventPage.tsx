import EventPaymentSetup from "@/components/CreateEventPage/EventPaymentSetup";
import EventProfileSetup from "@/components/CreateEventPage/EventProfileSetup";
import EventPromotionSetup from "@/components/CreateEventPage/EventPromotionSetup";
import EventTicketSetup from "@/components/CreateEventPage/EventTicketSetup";
import { Button } from "@/components/ui/button";
import { getEventByIdAPI } from "@/services/eventService";
import { useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Thông tin khuyến mãi",
  "Thông tin thanh toán",
];

export default function CreateEventPage() {
  const { step, setStep, setPrevStep, setNextStep, setMaSuKien, setEventData } =
    useEventStore();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    if (eventId) {
      setMaSuKien(eventId);
      getEventByIdAPI(eventId).then((data) => {
        setEventData(data);
      });
    }
  }, [eventId, setMaSuKien, setEventData]);

  return (
    <div className="shadow-2xl rounded-2xl overflow-hidden">
      <div className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center ">
          {steps.map((label, index) => (
            <div
              key={index + 1}
              onClick={setPrevStep}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  index < step
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  index + 1 <= step ? "text-green-400" : "text-gray-300"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-[2px] mx-5 ${
                    index < step ? "bg-green-400" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={setNextStep}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Tiếp tục
        </Button>
      </div>
      <div>
        {step === 1 && <EventProfileSetup />}
        {step === 2 && <EventTicketSetup />}
        {step === 3 && <EventPromotionSetup />}
        {step === 4 && <EventPaymentSetup />}
      </div>
    </div>
  );
}
