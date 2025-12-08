import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthProvider";

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white h-screen shadow-md p-5 border-r border-gray-100 fixed left-0 top-0 flex flex-col justify-between">
        <p className="text-lg font-bold uppercase">Trang quản trị viên</p>

        <ul className="flex flex-col gap-2 mt-6 flex-1">
          <li>
            <NavLink
              to="/admin"
              end
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
              to="/admin/account-manage"
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
                Quản lý người dùng
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/event-manage"
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
                Quản lý sự kiện
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/category-manage"
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
                Quản lý loại sự kiện
              </Button>
            </NavLink>
          </li>
        </ul>

        <Button onClick={logout}>Đăng xuất</Button>
      </aside>

      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
