import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ticket, User, LogOut, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IMAGE_URL } from "@/constant/constant";

export function AccountMenu() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { userProfile } = useAuth();
  console.log(userProfile);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <img
            src={IMAGE_URL + userProfile?.anhdaidien}
            alt="avatar"
            className="w-7 h-7 rounded-full"
          />
          <span className="truncate max-w-[150px]">
            {userProfile?.tennguoidung}
          </span>

          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 mt-1 rounded-2xl shadow-lg"
      >
        <DropdownMenuItem>
          <NavLink
            to="/my-profile"
            className="flex items-center gap-2 cursor-pointer w-full py-1"
          >
            <User className="w-4 h-4" />
            Tài khoản của tôi
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink
            to="/my-order"
            className="flex items-center gap-2 cursor-pointer w-full py-1"
          >
            <Ticket className="w-4 h-4" />
            Đơn hàng của tôi
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
