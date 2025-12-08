import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getSpecialEventsAPI,
  getSuggestedEventsAPI,
  getEventTypesAPI,
} from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { IMAGE_URL, locations } from "../constant/constant";
const categoriesSuggest = ["Âm Nhạc", "Workshop", "Khác"];

function EventSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-200 rounded-lg animate-pulse" />
  );
}

function BannerSkeleton() {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden"></div>
  );
}

export default function HomePage() {
  const { data, isFetching } = useQuery({
    queryKey: ["eventsByCategory"],
    queryFn: () => getSuggestedEventsAPI(),
  });

  const { data: specialEvent, isFetching: loadingSpecialEvents } = useQuery({
    queryKey: ["specialEvents"],
    queryFn: () => getSpecialEventsAPI(),
  });
  const { data: categories } = useQuery({
    queryKey: ["publicEventCategories"],
    queryFn: () => getEventTypesAPI(),
  });

  const categoryList = categories?.map((c: any) => c.tenloaisukien) || [
    "Âm Nhạc",
    "Sân Khấu",
    "Workshop",
    "Thể Thao",
    "Khác",
  ];

  return (
    <div>
      <nav className="h-[60px] bg-white shadow-sm w-full flex items-center justify-center mb-4 border-b border-green-200">
        <ul className="flex h-full items-center w-[1284px] gap-3 ">
          {categoryList.map((item: any) => (
            <li key={item}>
              <NavLink to={`search?type=${item}`}>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full transition"
                >
                  {item}
                </Button>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="w-[1284px] mx-auto relative">
        <div>
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {loadingSpecialEvents ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem key={index} className="flex-[0_0_50%] relative">
                    <BannerSkeleton />
                  </CarouselItem>
                ))
              ) : specialEvent?.length > 0 ? (
                specialEvent.map((item: any) => (
                  <CarouselItem
                    key={item.masukien}
                    className="flex-[0_0_50%] relative"
                  >
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                      <img
                        src={IMAGE_URL + item.anhsukienngang}
                        alt={item.masukien}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-4 left-4">
                        <Button asChild>
                          <NavLink to={`/event?maSuKien=${item.masukien}`}>
                            Xem chi tiết
                          </NavLink>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <p>Không có sự kiện nổi bật</p>
              )}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>

        <section className="mt-8">
          <p className="font-semibold text-lg mb-3">Sự kiện đặc biệt</p>

          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {loadingSpecialEvents ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="flex-[0_0_25%] relative">
                    <EventSkeleton />
                  </CarouselItem>
                ))
              ) : specialEvent?.length > 0 ? (
                specialEvent.map((item: any) => (
                  <CarouselItem
                    key={item.masukien}
                    className="flex-[0_0_25%] relative"
                  >
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                      <img
                        src={IMAGE_URL + item.anhsukiendoc}
                        alt={item.masukien}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-2 left-2">
                        <Button asChild size="sm">
                          <NavLink to={`/event?maSuKien=${item.masukien}`}>
                            Xem chi tiết
                          </NavLink>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <p>Không có sự kiện nào</p>
              )}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>

        {categoriesSuggest.map((category) => (
          <div key={category} className="mt-8">
            <p className="font-semibold text-lg mb-3">{category}</p>
            <div className="grid grid-cols-4 gap-4 ">
              {!isFetching ? (
                data?.[category]?.map((item: any) => (
                  <EventCard
                    key={item.masukien}
                    maSuKien={item.masukien}
                    tenSuKien={item.tensukien}
                    anhBanner={item.anhsukienngang}
                    thoiGianBatDau={item?.suat_dien?.[0]?.thoigianbatdau}
                    giaTien={item?.suat_dien?.[0]?.loaiVe?.[0].giaTien}
                  />
                ))
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-8">
          <p className="font-semibold text-lg mb-3">Sự kiện theo khu vực</p>
          <div className="flex gap-4">
            {locations.map((loc) => (
              <NavLink
                to={`/search?area=${loc.name}`}
                key={loc.name}
                className="relative rounded-2xl overflow-hidden w-[300px] h-[200px]"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-green-100 opacity-70"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className="text-white font-bold text-lg">
                    {loc.name}
                  </span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
