import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileUserAPI } from "@/services/authService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { IMAGE_URL } from "@/constant/constant";
import { useEffect, useState } from "react";
import { updateProfileUserAPI } from "@/services/userService";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [tennguoidung, setTenNguoiDung] = useState("");
  const [sodienthoai, setSoDienThoai] = useState("");
  const [anhdaidien, setAnhDaiDien] = useState<File | null>(null);

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
    },
    onError: () => {
      toast.error("Cập nhật thất bại!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneDigits = sodienthoai.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
      toast.error("Số điện thoại phải là 10 chữ số");
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
          Cung cấp thông tin chính xác để hỗ trợ bạn trong quá trình mua vé hoặc
          khi cần xác thực vé.
        </p>
      </div>

      <form
        className="max-w-xl mx-auto mt-10 space-y-6"
        onSubmit={handleSubmit}
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

        <div className="pt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full hover:bg-green-600 text-green-500 text-base rounded-lg"
          >
            Đổi mật khẩu
          </Button>

          <Button
            type="submit"
            className="h-11 w-full bg-green-500 hover:bg-green-600 text-white text-base rounded-lg"
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
}
