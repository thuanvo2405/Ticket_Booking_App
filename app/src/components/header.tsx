import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import AuthModal from "./authModal/AuthModal";
import { useAuth } from "@/context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountMenu } from "./account-menu";
import { Search } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useSearchParams } from "react-router-dom";
import SearchModal, { type SearchSuggestion } from "./SearchModal";
import { searchEventsForUserAPI } from "@/services/eventService";

export default function Header() {
  const [modalOpen, setModalOpen] = useState<null | "login" | "register">(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { tenSuKien, setTenSuKien, searchEvents } = useSearchStore();
  const [searchParams] = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (tenSuKien) {
      params.set("tenSuKien", tenSuKien);
    } else {
      params.delete("tenSuKien");
    }

    searchEvents();

    navigate(`/search?${params.toString()}`);
    setSearchModalOpen(false);
  };

  useEffect(() => {
    abortControllerRef.current?.abort();

    let cancelled = false;

    if (!tenSuKien.trim()) {
      setSearchModalOpen(false);
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSearchModalOpen(true);
    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const res = await searchEventsForUserAPI({
          page: 1,
          limit: 3,
          tenSuKien: tenSuKien.trim(),
          signal: controller.signal,
        });

        if (!cancelled) {
          const data = res.data || res || [];
          setSearchSuggestions(data.slice(0, 3));
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (!cancelled) {
          console.error("Search suggestion failed:", error);
          setSearchSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [tenSuKien]);

  const handleSelectSuggestion = (maSuKien: string) => {
    setSearchModalOpen(false);
    navigate(`/event?maSuKien=${maSuKien}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className="relative" ref={searchContainerRef}>
              <div className="bg-white flex items-center rounded-full shadow-sm overflow-hidden border border-gray-200 w-[520px]">
                <Search className="text-gray-400 mx-2" />
                <input
                  type="text"
                  placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
                  className="w-full py-2 pr-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
                  value={tenSuKien}
                  onChange={(e) => setTenSuKien(e.target.value)}
                  onFocus={() => {
                    if (tenSuKien.trim()) setSearchModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <Button
                  className="rounded-none rounded-r-full bg-green-500 hover:bg-green-600 text-white px-5"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
              <SearchModal
                open={searchModalOpen}
                query={tenSuKien}
                suggestions={searchSuggestions}
                isLoading={isSearching}
                onClose={() => setSearchModalOpen(false)}
                onSubmit={handleSearch}
                onSelect={(item) => handleSelectSuggestion(item.masukien)}
              />
            </div>

            <Button
              className="bg-white text-green-600 hover:bg-green-50"
              onClick={() => {
                if (!isLoggedIn()) {
                  setModalOpen("login");
                  return;
                }
                navigate("/organizer");
              }}
            >
              Tạo sự kiện
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn() ? (
              <>
                <AccountMenu />
              </>
            ) : (
              <>
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
