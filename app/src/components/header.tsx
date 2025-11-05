import { useState } from "react";
import { Button } from "./ui/button";
import AuthModal from "./authModal/AuthModal";
import { useAuth } from "@/context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountMenu } from "./account-menu";

export default function Header() {
  const [modalOpen, setModalOpen] = useState<null | "login" | "register">(null);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="w-full bg-green-500 shadow-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[76px] px-6">
          <div
            className="text-3xl font-bold text-white tracking-wide cursor-pointer select-none hover:opacity-90 transition"
            onClick={() => navigate("/")}
          >
            Eventify
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white flex items-center rounded-full shadow-sm overflow-hidden border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-3"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.34-4.34" />
              </svg>
              <input
                type="text"
                placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
                className="w-64 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              <Button className="rounded-none rounded-r-full bg-green-500 hover:bg-green-600 text-white px-5">
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
