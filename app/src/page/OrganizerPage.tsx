import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import CreateOrganizerPage from "./CreateOrganizerPage";

const organization = {
  tenToChuc: "Công ty Tổ Chức Sự Kiện Ánh Dương",
  hinhToChuc:
    "https://bcassetcdn.com/public/blog/wp-content/uploads/2019/06/18095707/Ticket-Bites.png",
  moTa: "Chúng tôi chuyên tổ chức các sự kiện âm nhạc, hội thảo và lễ hội trên toàn quốc với hơn 10 năm kinh nghiệm.",
};

export default function OrganizerPage() {
  const { user } = useAuth();

  if (user?.vaitro === "KHACH_HANG") return <CreateOrganizerPage />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <div className="flex items-center gap-6 border-b pb-4">
        <img
          src={organization.hinhToChuc}
          alt="Logo tổ chức"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex flex-col justify-center flex-1">
          <p className="text-3xl font-bold">{organization.tenToChuc}</p>
          <div className="mt-3">
            <Button>Chỉnh sửa hồ sơ</Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Giới thiệu</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          {organization.moTa}
        </p>
      </div>
    </div>
  );
}
