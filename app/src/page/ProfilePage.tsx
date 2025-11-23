import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileUserAPI } from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { IMAGE_URL } from "@/constant/constant";
import { useEffect, useState } from "react";
import { updateProfileUserAPI } from "@/services/userService";
import toast from "react-hot-toast";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import { useAuth } from "@/context/AuthProvider";

export default function ProfilePage() {
  const [tennguoidung, setTenNguoiDung] = useState("");
  const [sodienthoai, setSoDienThoai] = useState("");
  const [anhdaidien, setAnhDaiDien] = useState<File | null>(null);
  const { setUserProfile } = useAuth();
  const { data, isFetching } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: getProfileUserAPI,
  });

  useEffect(() => {
    if (data) {
      setTenNguoiDung(data.tennguoidung);
      setSoDienThoai(data.sodienthoai || "");
    }
  }, [data]);

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      updateProfileUserAPI(
        tennguoidung || undefined,
        sodienthoai ? Number(sodienthoai) : undefined,
        anhdaidien || undefined
      ),
    onSuccess: () => {
      toast("Cập nhật thành công!");
      setUserProfile({
        tennguoidung,
        anhdaidien: anhdaidien ? anhdaidien.name : data.anhdaidien,
      });
    },
    onError: () => {
      toast.error("Cập nhật thất bại!");
    },
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (tennguoidung.trim().length < 2) {
      toast.error("Họ và tên phải có ít nhất 2 ký tự!");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(sodienthoai)) {
      toast.error("Số điện thoại phải gồm đúng 10 chữ số!");
      return;
    }

    const isNameChanged = tennguoidung !== data.tennguoidung;
    const isPhoneChanged = sodienthoai !== (data.sodienthoai || "");
    const isAvatarChanged = anhdaidien !== null;

    if (!isNameChanged && !isPhoneChanged && !isAvatarChanged) {
      toast("Không có dữ liệu nào thay đổi");
      return;
    }

    updateProfileMutation.mutate();
  };

  if (isFetching) return <h1>loading</h1>;

  return (
    <div className="bg-white min-h-[calc(100vh-100px)] px-10 py-10 rounded-2xl shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 border-b pb-4">
          Thông tin tài khoản
        </h1>

        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <img
              src={
                anhdaidien
                  ? URL.createObjectURL(anhdaidien)
                  : IMAGE_URL + data.anhdaidien
              }
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatarInput"
              onChange={(e) => {
                if (e.target.files?.[0]) setAnhDaiDien(e.target.files[0]);
              }}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full p-1 shadow bg-white hover:bg-gray-100"
              onClick={() => document.getElementById("avatarInput")?.click()}
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center max-w-md">
            Cung cấp thông tin chính xác để hỗ trợ bạn trong quá trình mua vé
            hoặc khi cần xác thực vé.
          </p>
        </div>

        <form
          className="mx-auto mt-10 space-y-6"
          onSubmit={handleSubmitProfile}
        >
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Họ và tên
            </Label>
            <Input
              id="name"
              placeholder="Nhập họ và tên"
              value={tennguoidung}
              onChange={(e) => setTenNguoiDung(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Số điện thoại
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                className="h-11"
                value={sodienthoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="vothuan2405003@gmail.com"
              disabled
              className="bg-gray-100 h-11"
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-green-500 hover:bg-green-600 text-white text-base rounded-lg"
          >
            Cập nhật
          </Button>
        </form>
        <ResetPasswordModal triggerText="Đổi mật khẩu" />
      </div>
    </div>
  );
}
