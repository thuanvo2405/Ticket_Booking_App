import EventPaymentSetup from "@/components/CreateEventPage/EventPaymentSetup";
import EventProfileSetup from "@/components/CreateEventPage/EventProfileSetup";
import EventTicketSetup from "@/components/CreateEventPage/EventTicketSetup";
import { Button } from "@/components/ui/button";

import { useState } from "react";

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Thông tin thanh toán",
];

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="shadow-2xl rounded-2xl overflow-hidden">
      <div className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {steps.map((label, index) => (
            <div
              key={index}
              onClick={() => prevStep()}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  index <= currentStep ? "text-green-400" : "text-gray-300"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-[2px] mx-4 ${
                    index < currentStep ? "bg-green-400" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
          >
            Lưu
          </Button>
          <Button
            onClick={nextStep}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
      <div>
        {currentStep === 0 && <EventProfileSetup />}
        {currentStep === 1 && <EventTicketSetup />}
        {currentStep === 2 && <EventPaymentSetup />}
      </div>
    </div>
  );
}
