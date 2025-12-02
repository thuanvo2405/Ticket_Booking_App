import EventProfileSetup from "@/components/CreateEventPage/EventProfileSetup";
import EventPromotionSetup from "@/components/CreateEventPage/EventPromotionSetup";
import EventTicketSetup from "@/components/CreateEventPage/EventTicketSetup";
import { useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Thông tin khuyến mãi",
];

export default function CreateEventPage() {
  const { step, setMaSuKien } = useEventStore();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    if (eventId) {
      setMaSuKien(eventId);
    }
  }, [eventId, setMaSuKien]);

  return (
    <div className="shadow-2xl rounded-2xl overflow-hidden">
      <div className="w-full bg-gray-900 text-white px-6 py-6 rounded-t-2xl shadow-md">
        <div className="flex items-center justify-between">
          {steps.map((label, index) => {
            const isActive = index + 1 === step;
            const isCompleted = index + 1 < step;

            return (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    isActive
                      ? "bg-green-500 border-green-500 text-white"
                      : isCompleted
                      ? "bg-green-400 border-green-400 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-400"
                  } transition-all duration-300`}
                >
                  {isCompleted ? "✔" : index + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isActive
                      ? "text-green-400 font-semibold"
                      : isCompleted
                      ? "text-green-200"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        {step === 1 && <EventProfileSetup />}
        {step === 2 && <EventTicketSetup />}
        {step === 3 && <EventPromotionSetup />}
      </div>
    </div>
  );
}
