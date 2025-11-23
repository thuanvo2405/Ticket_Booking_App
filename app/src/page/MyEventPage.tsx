import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProfileEventsByOrganizerID } from "@/services/eventService";
import EventProfileCard from "@/components/MyEventPage.tsx/EventProfileCard";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

export default function MyEventPage() {
  const [tab, setTab] = useState("all");
  const { user } = useAuth();
  console.log(user);
  const { data: events, isFetching } = useQuery({
    queryKey: ["fetchProfileEventByOrganizerID", tab],
    queryFn: () => {
      let status: string | undefined;
      if (tab === "wait") status = "CHO_DUYET";
      else if (tab === "accept") status = "DA_DUYET";
      else if (tab === "pending") status = "NHAP";
      else status = undefined;

      return fetchProfileEventsByOrganizerID(status);
    },
    enabled: user?.vaitro === "TO_CHUC",
  });

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-6">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="flex w-full items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            <Search className="ml-3 text-gray-500" size={18} />
            <Input
              placeholder="Tìm kiếm sự kiện"
              className="bg-transparent border-none focus-visible:ring-0 text-black placeholder:text-gray-500"
            />
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            Tìm kiếm
          </Button>
          {user?.vaitro === "TO_CHUC" ? (
            <Button className="bg-black text-white hover:bg-gray-800">
              <Link to="/organizer/create-event">Tạo Sự Kiện</Link>
            </Button>
          ) : (
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                toast.error("Bạn phải tạo hồ sơ tổ chức trước khi tạo sự kiện");
              }}
            >
              Tạo Sự Kiện
            </Button>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-gray-100 rounded-xl">
            <TabsTrigger
              value="all"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Tất cả
            </TabsTrigger>

            <TabsTrigger
              value="wait"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Chờ duyệt
            </TabsTrigger>
            <TabsTrigger
              value="accept"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Đã duyệt
            </TabsTrigger>

            <TabsTrigger
              value="pending"
              className="text-gray-600 hover:text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Nháp
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col w-full items-center gap-4">
        {events && events.length > 0 ? (
          <div className="flex flex-col w-full items-center">
            {events.map((event: any, index: number) => (
              <EventProfileCard key={index} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] text-gray-500">
            <div className="bg-gray-100 rounded-full p-6 shadow-sm">
              <CalendarIcon size={48} />
            </div>
            <p className="mt-4 text-sm">Hiện chưa có sự kiện nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
