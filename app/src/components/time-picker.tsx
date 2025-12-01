import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { useSearchStore } from "@/store/useSearchStore";
import { vi } from "date-fns/locale";

export default function TimePicker() {
  const { fromDate, toDate, setFromDate, setToDate } = useSearchStore();
  const [open, setOpen] = React.useState(false);

  const getDateLabel = () => {
    if (!fromDate) return "Chọn ngày";
    if (!toDate) return format(fromDate, "yyyy-MM-dd");
    return `${format(fromDate, "dd-MM-yyyy")} - ${format(
      toDate,
      "yyyy-MM-dd"
    )}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    setFromDate(range?.from);
    setToDate(range?.to);
  };

  const quickSelect = (label: string) => {
    const today = new Date();
    let from: Date | undefined = undefined;
    let to: Date | undefined = undefined;

    switch (label) {
      case "Tất cả các ngày":
        from = undefined;
        to = undefined;
        break;

      case "Hôm nay":
        from = today;
        to = today;
        break;

      case "Ngày mai":
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        from = tomorrow;
        to = tomorrow;
        break;

      case "Cuối tuần":
        const friday = new Date();
        friday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));

        const sunday = new Date(friday);
        sunday.setDate(friday.getDate() + 2);

        from = friday;
        to = sunday;
        break;

      case "Tháng này":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
    }

    setFromDate(from);
    setToDate(to);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal text-left hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar-days text-gray-600"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              <span>{getDateLabel()}</span>
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-4 bg-white rounded-xl shadow-lg border"
          align="start"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "Tất cả các ngày",
              "Hôm nay",
              "Ngày mai",
              "Cuối tuần",
              "Tháng này",
            ].map((label) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => quickSelect(label)}
                className="rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {label}
              </Button>
            ))}
          </div>

          <Calendar
            locale={vi}
            mode="range"
            defaultMonth={fromDate || new Date()}
            selected={{ from: fromDate, to: toDate }}
            onSelect={handleSelect}
            numberOfMonths={2}
            showOutsideDays={false}
            className="rounded-lg border shadow-sm mx-auto w-full"
          />

          <div className="flex gap-3 p-3 mt-2 border-t">
            <Button
              variant="outline"
              className="flex-1 border-green-400 text-green-600 hover:bg-green-50"
              onClick={() => {
                setFromDate(undefined);
                setToDate(undefined);
              }}
            >
              Thiết lập lại
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setOpen(false)}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
