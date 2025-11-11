import { NavLink } from "react-router-dom";

export default function EventCard() {
  return (
    <NavLink
      to="/"
      className="block rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <img src="/img.jpg" alt="" className="w-full h-[200px] object-cover" />
      <div className="p-3">
        <p className="font-semibold line-clamp-2 my-1">
          [CAT&MOUSE] CA SĨ HƯƠNG TRÀM - ĐÊM BALLAD TAN CHẢY TRÁI TIM
        </p>
        <p className="text-green-600 my-2 font-semibold">Từ 499.999đ</p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calendar"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          31 tháng 10, 2025
        </div>
      </div>
    </NavLink>
  );
}
