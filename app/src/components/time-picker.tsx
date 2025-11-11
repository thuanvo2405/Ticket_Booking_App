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

export default function TimePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });
  const [open, setOpen] = React.useState(false);

  const getDateLabel = () => {
    if (!dateRange?.from) return "Chọn ngày";
    if (!dateRange.to) return format(dateRange.from, "PPP");

    return `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-80 justify-between font-normal text-left hover:bg-gray-50 transition-all"
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
          {/* Quick filter buttons */}
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
                className="rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm mx-auto"
          />

          {/* Action buttons */}
          <div className="flex gap-3 p-3 mt-2 border-t">
            <Button
              variant="outline"
              className="flex-1 border-green-400 text-green-600 hover:bg-green-50"
              onClick={() => setDateRange(undefined)}
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
