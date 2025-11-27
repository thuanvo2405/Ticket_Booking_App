import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { resetPasswordAPI } from "@/services/authService";
import { useAuth } from "@/context/AuthProvider";
import { z } from "zod";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mật khẩu hiện tại tối thiểu 6 ký tự"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới tối thiểu 6 ký tự")
      .max(15, "Mật khẩu mới không dài quá 15 ký tự")
      .regex(passwordRegex, {
        message:
          "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordModal: React.FC<{ triggerText?: string }> = ({
  triggerText = "Đổi mật khẩu",
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      await resetPasswordAPI(data.currentPassword, data.newPassword);
      toast.success("Đổi mật khẩu thành công!");
      setOpen(false);
      reset();
      logout();
    } catch (err: any) {
      if (err.response?.data?.error === "Mật khẩu hiện tại không đúng") {
        setError("currentPassword", {
          type: "manual",
          message: "Mật khẩu hiện tại không đúng",
        });
      } else {
        toast.error(err.response?.data?.error || "Đổi mật khẩu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(state) => {
        if (!loading) setOpen(state);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" className="h-11 mt-3 w-full">
          {triggerText}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đổi mật khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            Nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-1">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Mật khẩu hiện tại"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mật khẩu mới"
              {...register("newPassword")}
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
              {...register("confirmPassword")}
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
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
