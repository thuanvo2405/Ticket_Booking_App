import { useState } from "react";
import { Button } from "./ui/button";
import AuthModal from "./authModal/AuthModal";
import { useAuth } from "@/context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountMenu } from "./account-menu";
import { Search } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function Header() {
  const [modalOpen, setModalOpen] = useState<null | "login" | "register">(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { tenSuKien, setTenSuKien, searchEvents } = useSearchStore();

  return (
    <>
      <header className="w-full bg-green-500 shadow-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[76px] px-6">
          <NavLink
            to="/"
            className="text-3xl font-bold text-white tracking-wide cursor-pointer select-none hover:opacity-90 transition"
          >
            Eventify
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="bg-white flex items-center rounded-full shadow-sm overflow-hidden border border-gray-200">
              <Search className="text-gray-400 mx-2" />
              <input
                type="text"
                placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
                className="w-64 py-2 pr-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
                value={tenSuKien}
                onChange={(e) => setTenSuKien(e.target.value)}
              />
              <Button
                className="rounded-none rounded-r-full bg-green-500 hover:bg-green-600 text-white px-5"
                onClick={() => {
                  searchEvents();
                  navigate(
                    `/search?tenSuKien=${encodeURIComponent(tenSuKien)}`
                  );
                }}
              >
                Tìm kiếm
              </Button>
            </div>

            <Button className="bg-white text-green-600 hover:bg-green-50">
              <NavLink to="organizer">Tạo sự kiện</NavLink>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn() ? (
              <>
                <NavLink to="/my-tickets">
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    Vé của tôi
                  </Button>
                </NavLink>
                <AccountMenu />
              </>
            ) : (
              <>
                <Button
                  className="bg-white text-green-600 hover:bg-green-50"
                  onClick={() => setModalOpen("login")}
                >
                  Vé của tôi
                </Button>
                <Button
                  className="bg-white text-green-600 hover:bg-green-50"
                  onClick={() => setModalOpen("register")}
                >
                  Đăng ký
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setModalOpen("login")}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {modalOpen && (
        <AuthModal initialTab={modalOpen} onClose={() => setModalOpen(null)} />
      )}
    </>
  );
}
