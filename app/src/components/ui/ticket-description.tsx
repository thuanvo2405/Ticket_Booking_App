import { useState } from "react";
import { Button } from "./button";

export default function TicketDescription({ moTa }: { moTa: string }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="shadow-xl border mt-10 rounded-2xl p-4">
      <p className="text-xl font-semibold text-center border-b py-3">
        Giới thiệu về sự kiện
      </p>

      <div className="relative p-4">
        <div
          className={
            showMore
              ? ""
              : "max-h-[300px] overflow-hidden transition-all duration-500 ease-in-out"
          }
          dangerouslySetInnerHTML={{ __html: moTa }}
        />

        {!showMore && (
          <div className="absolute bottom-14 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}

        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Thu gọn" : "Xem thêm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
