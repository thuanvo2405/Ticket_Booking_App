import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { AccountMenu } from "../account-menu";

export default function OrganizerLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white h-screen shadow-md p-5 border-r border-gray-100 fixed left-0 top-0">
        <p className="text-lg font-bold uppercase">Trang quản lý sự kiện</p>

        <ul className="flex flex-col gap-2 mt-6">
          <li>
            <NavLink
              to="/organizer"
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
                Hồ sơ của tôi
              </Button>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/organizer/my-events"
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
              to="/organizer/dashboard"
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
                Thống kê báo cáo
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
                Chuyển về trang chính
              </Button>
            </NavLink>
          </li>
        </ul>
      </aside>

      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <header className="bg-black/70 p-4 flex justify-end text-white">
          <AccountMenu />
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
