import { MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { deleteEventAPI } from "@/services/eventService";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMAGE_URL } from "@/constant/constant";
import { ConfirmDialog } from "../ConfirmDialog";

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

  const getStatusTag = (status: string) => {
    switch (status) {
      case "NHAP":
        return (
          <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full border border-gray-400">
            Nháp
          </span>
        );
      case "CHO_DUYET":
        return (
          <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full border border-yellow-400">
            Chờ duyệt
          </span>
        );
      case "DA_DUYET":
        return (
          <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-500">
            Đã duyệt
          </span>
        );
      case "TU_CHOI":
        return (
          <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full border border-red-500">
            Bị từ chối
          </span>
        );
      default:
        return null;
    }
  };

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
          src={IMAGE_URL + event.anhsukienngang}
          alt="event"
          className="w-48 h-32 object-cover rounded-lg ring-1 ring-green-200"
        />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="font-bold text-2xl text-green-700">
                {event.tensukien}
              </p>
              {getStatusTag(event.trangthai)}
            </div>

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
          </div>

          <div className="flex justify-end gap-2 mt-3">
            {event.trangthai === "NHAP" && (
              <>
                <NavLink
                  to={`/organizer/create-event?eventId=${event.masukien}`}
                >
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    Quản lý sự kiện
                  </Button>
                </NavLink>

                <ConfirmDialog
                  title="Bạn có chắc muốn xóa sự kiện này?"
                  description="Hành động này không thể hoàn tác."
                  confirmText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => deleteMutation.mutate(event.masukien)}
                  textButton="Xóa"
                />
              </>
            )}

            {event.trangthai === "DA_DUYET" && (
              <NavLink to={`/organizer/my-events/${event.masukien}/stats`}>
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  Xem thống kê
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
