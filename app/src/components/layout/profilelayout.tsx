import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { IMAGE_URL } from "@/constant/constant";

export default function ProfileLayout() {
  const location = useLocation();
  const { userProfile } = useAuth();
  const getPageTitle = () => {
    if (location.pathname.includes("my-tickets")) return "Vé của tôi";
    if (location.pathname.includes("my-events")) return "Sự kiện của tôi";
    if (location.pathname.includes("my-profile")) return "Thông tin cá nhân";
    return "Tài khoản";
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="w-[1280px] mx-auto flex items-center gap-2 text-sm text-gray-500 px-6 py-2">
          <a href="/" className="hover:text-green-600 transition-colors">
            Trang chủ
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 font-medium">{getPageTitle()}</span>
        </div>
      </header>

      <div className="w-[1280px] mx-auto grid grid-cols-[280px_1fr] gap-6 py-10">
        <aside className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <div className="flex flex-col items-center gap-3 pb-6 border-b">
            <img
              src={IMAGE_URL + userProfile?.anhdaidien}
              alt="avatar"
              className="w-20 h-20 rounded-full border"
            />
            <p className="text-lg font-semibold text-gray-800">
              {userProfile?.tennguoidung}
            </p>
          </div>

          <ul className="flex flex-col gap-2 mt-6">
            <li>
              <NavLink
                to="/my-tickets"
                className={({ isActive }) =>
                  `w-full block ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100 text-gray-700"
                  } rounded-lg`
                }
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start font-medium"
                >
                  Vé của tôi
                </Button>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/my-events"
                className={({ isActive }) =>
                  `w-full block ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100 text-gray-700"
                  } rounded-lg`
                }
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start font-medium"
                >
                  Sự kiện của tôi
                </Button>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/my-profile"
                className={({ isActive }) =>
                  `w-full block ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100 text-gray-700"
                  } rounded-lg`
                }
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start font-medium"
                >
                  Thông tin cá nhân
                </Button>
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
