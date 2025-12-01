"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

type FilterData = {
  area?: string;
  type?: string;
};

interface OptionPickerProps {
  onApply?: (data: FilterData) => void;
}

export default function OptionPicker({ onApply }: OptionPickerProps) {
  const [open, setOpen] = useState(false);
  const area = useSearchStore((state) => state.area);
  const eventType = useSearchStore((state) => state.eventType);
  const setEventType = useSearchStore((state) => state.setEventType);
  const setArea = useSearchStore((state) => state.setArea);
  const handleReset = () => {
    setArea("");
    setEventType("");
  };

  const handleApply = () => {
    onApply?.({
      area: area,
      type: eventType,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-5">
        <div>
          <p className="font-semibold mb-2">Khu vực</p>
          <RadioGroup value={area} onValueChange={setArea}>
            {[
              "Toàn quốc",
              "Hồ Chí Minh",
              "Hà Nội",
              "Đà Nẵng",
              "Khu vực khác",
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={item}
                  defaultValue={area}
                  id={`area-${i}`}
                />
                <Label htmlFor={`area-${i}`}>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <p className="font-semibold mb-2">Thể loại</p>
          <RadioGroup value={eventType} onValueChange={setEventType}>
            {["Âm Nhạc", "Sân Khấu", "Thể Thao", "Workshop", "Khác"].map(
              (item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={item} id={`type-${i}`} />
                  <Label htmlFor={`type-${i}`}>{item}</Label>
                </div>
              )
            )}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-3 border-t">
          <Button variant="outline" onClick={handleReset}>
            Thiết lập lại
          </Button>
          <Button onClick={handleApply}>Áp dụng</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
