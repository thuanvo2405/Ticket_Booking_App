import Card from "@/components/event-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NavLink } from "react-router";

export default function HomePage() {
  return (
    <div>
      <nav className="h-[60px] bg-white shadow-sm w-full flex items-center justify-center mb-4 border-b border-green-200">
        <ul className="flex h-full items-center w-[1284px] gap-3 ">
          <li>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full transition"
            >
              Nhạc sống
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full transition"
            >
              Sân khấu và nghệ thuật
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full transition"
            >
              Thể thao
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-full transition"
            >
              Khác
            </Button>
          </li>
        </ul>
      </nav>

      <div className="w-[1284px] mx-auto relative">
        <div>
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="flex-[0_0_50%] relative">
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                    <img
                      src="/img.jpg"
                      alt={`slide-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <Button>Xem chi tiết</Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10" />
          </Carousel>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-3 h-3 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>

        <section className="mt-8">
          <p className="font-semibold text-lg mb-3">Sự kiện đặc biệt</p>
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="flex-[0_0_25%] relative">
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                    <img
                      src="/img.jpg"
                      alt={`slide-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>

        <div className="mt-8">
          <p className="font-semibold text-lg mb-3">Nhạc sống</p>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="font-semibold text-lg mb-3">Sân khấu & Nghệ thuật</p>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <p className="font-semibold text-lg mb-3">Thể loại khác</p>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <p className="font-semibold text-lg mb-3">Sự kiện theo khu vực</p>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <NavLink
                to="/"
                key={index}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src="/place.jpg"
                  alt={`slide-${index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-green-100 opacity-70"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className="text-white font-bold text-lg">
                    Khu vực {index + 1}
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
