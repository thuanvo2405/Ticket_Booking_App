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
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

type FilterData = {
  area?: string;
  type?: string;
  price?: number[];
};

interface OptionPickerProps {
  onApply?: (data: FilterData) => void;
}

export default function OptionPicker({ onApply }: OptionPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [price, setPrice] = useState<number[]>([100]);

  const handleReset = () => {
    setSelectedArea("");
    setSelectedType("");
    setPrice([100]);
  };

  const handleApply = () => {
    onApply?.({
      area: selectedArea,
      type: selectedType,
      price,
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
        {/* --- KHU VỰC --- */}
        <div>
          <p className="font-semibold mb-2">Khu vực</p>
          <RadioGroup value={selectedArea} onValueChange={setSelectedArea}>
            {[
              "Toàn quốc",
              "Hồ Chí Minh",
              "Hà Nội",
              "Đà Nẵng",
              "Khu vực khác",
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={item} id={`area-${i}`} />
                <Label htmlFor={`area-${i}`}>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* --- THỂ LOẠI --- */}
        <div>
          <p className="font-semibold mb-2">Thể loại</p>
          <RadioGroup value={selectedType} onValueChange={setSelectedType}>
            {["Âm nhạc", "Sân khấu", "Thể thao", "Khác"].map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={item} id={`type-${i}`} />
                <Label htmlFor={`type-${i}`}>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* --- GIÁ --- */}
        <div>
          <p className="font-semibold mb-2">Giá tối đa (nghìn đồng)</p>
          <Slider value={price} onValueChange={setPrice} max={1000} step={50} />
          <p className="text-sm text-muted-foreground mt-1">{price[0]}k</p>
        </div>

        {/* --- BUTTON --- */}
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
