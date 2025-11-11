import EventCard from "@/components/event-card";
import OptionPicker from "@/components/option-picker";
import TimePicker from "@/components/time-picker";

export default function SearchPage() {
  return (
    <div className="w-[1284px] mx-auto">
      <div className="flex items-center py-3 justify-between">
        <p className="font-semibold">Kết quả tìm kiếm</p>
        <div className="flex gap-3">
          <TimePicker />
          <OptionPicker />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
}
