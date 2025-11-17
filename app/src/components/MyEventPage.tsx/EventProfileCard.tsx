import { MapPin, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { deleteEventAPI } from "@/services/eventService";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EventProfileCard({ event }: { event: any }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (maSuKien: string) => deleteEventAPI(maSuKien),

    onSuccess: () => {
      toast.success("Xóa sự kiện thành công!");
      queryClient.invalidateQueries({
        queryKey: ["fetchProfileEventByOrganizerID"],
        exact: false,
      });
    },

    onError: () => {
      toast.error("Xóa sự kiện thất bại!");
    },
  });

  return (
    <div
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

          <div className="flex justify-end gap-2">
            <NavLink to={`/organizer/create-event?eventId=${event.masukien}`}>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Quản lý sự kiện
              </Button>
            </NavLink>

            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteMutation.mutate(event.masukien);
              }}
            >
              Xóa sự kiện
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
