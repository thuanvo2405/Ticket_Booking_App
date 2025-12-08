import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import z from "zod";

import {
  type EventCategory,
  createAdminCategoryAPI,
  updateAdminCategoryAPI,
} from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const categorySchema = z.object({
  tenloaisukien: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên sự kiện")
    .max(100, "Tên loại sự kiện quá dài"),
});

type CategoryFormDialogProps = {
  mode: "create" | "edit";
  category?: EventCategory;
  onSuccess: () => void;
  disabled?: boolean;
};

export function CategoryFormDialog({
  mode,
  category,
  onSuccess,
  disabled,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      tenloaisukien: category?.tenloaisukien ?? "",
    },
  });

  useEffect(() => {
    if (open && mode === "edit" && category) {
      form.reset({ tenloaisukien: category.tenloaisukien });
    }
    if (!open && mode === "create") {
      form.reset({ tenloaisukien: "" });
    }
  }, [category, form, mode, open]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof categorySchema>) => {
      if (mode === "create") {
        return createAdminCategoryAPI(values.tenloaisukien);
      }

      if (!category) {
        throw new Error("Thiếu thông tin loại sự kiện");
      }

      return updateAdminCategoryAPI(
        category.maloaisukien,
        values.tenloaisukien
      );
    },
    onSuccess: () => {
      toast.success(
        mode === "create"
          ? "Thêm loại sự kiện thành công"
          : "Cập nhật loại sự kiện thành công"
      );
      onSuccess();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    mutation.mutate(values);
  };

  const triggerIcon =
    mode === "create" ? (
      <Plus className="w-4 h-4" />
    ) : (
      <Pencil className="w-4 h-4" />
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "create" ? "default" : "outline"}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            {triggerIcon}
            {mode === "create" ? "Thêm loại sự kiện" : "Chỉnh sửa"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Thêm loại sự kiện mới"
              : "Chỉnh sửa loại sự kiện"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm loại sự kiện để tổ chức có thể gán cho sự kiện mới."
              : "Cập nhật tên loại sự kiện để hiển thị chính xác cho người dùng."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenloaisukien"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại sự kiện</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Âm nhạc, Hội thảo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </span>
              ) : mode === "create" ? (
                "Thêm"
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
