import { MapPin, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function EventProfileCard({ event }: { event: any }) {
  console.log(event);
  return (
    <NavLink
      to={`/organizer/create-event?eventId=${event.masukien}`}
      className="
        w-full bg-white 
        rounded-xl border border-green-500 
        shadow-sm hover:shadow-md hover:shadow-green-600/20
        transition-all duration-300 p-4 mb-4 
        hover:scale-[1.02]
      "
    >
      <div className="flex gap-4">
        <img
          src="/img.jpg"
          alt="event"
          className="w-48 h-32 object-cover rounded-lg ring-1 ring-green-200"
        />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <p className="font-bold text-2xl text-green-700 mb-1">
              {event.tensukien}
            </p>

            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={18} className="text-green-600 mt-0.5" />
              <span>
                {event.diachi +
                  ", " +
                  event.phuong +
                  ", " +
                  event.quan +
                  ", " +
                  event.thanhpho}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
              <Calendar size={18} className="text-green-600" />
              <span>{event.ngaydienra || "Chưa cập nhật ngày"}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="
                px-4 py-1.5 
                bg-green-600 text-white 
                rounded-lg text-sm 
                hover:bg-green-700 transition
              "
            >
              Quản lý sự kiện
            </button>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
