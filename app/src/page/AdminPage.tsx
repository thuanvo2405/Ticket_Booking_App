import { User } from "lucide-react";
import DashBoardCard from "../components/AdminPage/DashBoardCard";

export default function AdminPage() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <DashBoardCard
          title="Tổng số người dùng"
          value={2000}
          icon={<User />}
        />
        <DashBoardCard
          title="Tổng sự kiện đang diễn ra"
          value={2000}
          icon={<User />}
        />
        <DashBoardCard
          title="Tổng sự kiện chờ duyệt"
          value={2000}
          icon={<User />}
        />
        <DashBoardCard
          title="Số lượng vé đã bán"
          value={2000}
          icon={<User />}
        />
      </div>
      <div></div>
    </div>
  );
}
