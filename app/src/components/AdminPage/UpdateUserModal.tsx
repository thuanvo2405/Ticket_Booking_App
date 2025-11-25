import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAPI } from "@/services/userService";
import { useState } from "react";

const updateSchema = z.object({
  userName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  vaitro: z
    .enum(["QUAN_TRI", "TO_CHUC", "KHACH_HANG"] as const)
    .refine((val) => !!val, { message: "Chức vụ không hợp lệ" }),
});

interface UpdateUserModalProps {
  user: {
    manguoidung: string;
    tennguoidung: string;
    email: string;
    vaitro: "QUAN_TRI" | "TO_CHUC" | "KHACH_HANG";
  };
  onSuccess: () => void;
}

export default function UpdateUserModal({
  user,
  onSuccess,
}: UpdateUserModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      userName: user.tennguoidung,
      email: user.email,
      vaitro: user.vaitro,
    },
  });

  const updateUser = useMutation({
    mutationFn: (values: z.infer<typeof updateSchema>) =>
      updateUserAPI(user.manguoidung, {
        tennguoidung: values.userName,
        email: values.email,
        chucvu: values.vaitro,
      }),
    onSuccess: () => {
      setOpen(false);
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      form.setError("email", {
        message: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof updateSchema>) => {
    updateUser.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sửa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật người dùng</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin người dùng</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vaitro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức vụ</FormLabel>
                  <FormControl>
                    <select {...field} className="input w-full">
                      <option value="QUAN_TRI">Quản trị viên</option>
                      <option value="TO_CHUC">Tổ chức</option>
                      <option value="KHACH_HANG">Người dùng</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={updateUser.isPending}
              className="w-full py-3 mt-2 bg-gradient-to-r from-green-400 to-teal-500 hover:from-teal-500 hover:to-green-400 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              {updateUser.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
