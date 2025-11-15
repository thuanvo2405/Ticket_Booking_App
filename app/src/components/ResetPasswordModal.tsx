import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { resetPasswordAPI } from "@/services/authService";
import { useAuth } from "@/context/AuthProvider";

interface ResetPasswordModalProps {
  triggerText?: string;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  triggerText = "Đổi mật khẩu",
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const newPasswordValue = watch("newPassword");

  const onSubmitReset = async (data: FormValues) => {
    if (data.newPassword.length < 6) {
      toast.error("Mật khẩu phải trên 6 ký tự");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Xác nhận mật khẩu không trùng khớp");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordAPI(data.newPassword);
      toast.success("Đổi mật khẩu thành công!");
      setOpen(false);
      reset();
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" className="h-11 w-full">
          {triggerText}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đổi mật khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            Nhập mật khẩu mới và xác nhận mật khẩu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={handleSubmit(onSubmitReset)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-1">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mật khẩu mới"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải ít nhất 6 ký tự",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === newPasswordValue ||
                  "Xác nhận mật khẩu không trùng khớp",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white w-full"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
