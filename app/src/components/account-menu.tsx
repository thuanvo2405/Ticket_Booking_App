import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Calendar,
  User,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function AccountMenu() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=user"
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
          <span>Tài khoản</span>

          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 mt-1 rounded-2xl shadow-lg"
      >
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <NavLink to="/">
            <Ticket className="w-4 h-4" />
          </NavLink>
          Vé của tôi
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Calendar className="w-4 h-4" />
          Sự kiện của tôi
        </DropdownMenuItem>

        <DropdownMenuItem>
          <NavLink
            to="/my-profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            Tài khoản của tôi
          </NavLink>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-red-500 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
