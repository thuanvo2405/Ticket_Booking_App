import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DateTimePicker24h({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
}) {
  const date = value ?? new Date();

  const setHour = (hour: number) => {
    const newDate = new Date(date);
    newDate.setHours(hour);
    onChange(newDate);
  };

  const setMinute = (minute: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(minute);
    onChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? format(value, "dd/MM/yyyy HH:mm") : "Chọn ngày & giờ"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 overflow-visible w-auto">
        <div className="flex border rounded-md overflow-hidden">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => d && onChange(d)}
            className="p-3"
          />

          <div className="flex border-l">
            <ScrollArea className="h-[320px] w-16">
              <div className="flex flex-col">
                {Array.from({ length: 24 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setHour(i)}
                    className={`py-2 text-sm hover:bg-accent
                      ${date.getHours() === i ? "bg-accent font-medium" : ""}
                    `}
                  >
                    {i.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </ScrollArea>

            <ScrollArea className="h-[320px] w-16 border-l">
              <div className="flex flex-col">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinute(m)}
                    className={`py-2 text-sm hover:bg-accent
                      ${date.getMinutes() === m ? "bg-accent font-medium" : ""}
                    `}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
