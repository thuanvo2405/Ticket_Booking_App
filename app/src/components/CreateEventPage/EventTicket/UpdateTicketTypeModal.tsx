import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { updateTicketTypeAPI } from "@/services/ticketService";
import { useState } from "react";

export const UpdateTicketTypeSchema = z.object({
  maLoaiVe: z.string().uuid("Mã loại vé không hợp lệ"),
  tenLoaiVe: z.string().min(1, "Tên loại vé là bắt buộc"),
  moTa: z.string().optional(),
  giaTien: z
    .number({ message: "Giá tiền phải là số" })
    .min(1, "Giá tiền phải lớn hơn 0"),
  soLuongPhatHanh: z
    .number({ message: "Số lượng phải là số" })
    .min(1, "Số lượng phải lớn hơn 0"),
});

type UpdateTicketTypeSchemaType = z.infer<typeof UpdateTicketTypeSchema>;

interface UpdateTicketTypeModalProps {
  maLoaiVe: string;
  tenLoaiVe: string;
  soLuongPhatHanh: number;
  giaTien: number;
  moTa?: string;
}

export function UpdateTicketTypeModal({
  maLoaiVe,
  tenLoaiVe,
  soLuongPhatHanh,
  giaTien,
  moTa,
}: UpdateTicketTypeModalProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      tenLoaiVe,
      giaTien,
      soLuongPhatHanh,
      moTa,
    }: UpdateTicketTypeSchemaType) =>
      updateTicketTypeAPI(tenLoaiVe, giaTien, soLuongPhatHanh, maLoaiVe, moTa),
    onSuccess: () => {
      queryClient.invalidateQueries({});
      toast.success("Cập nhật loại vé thành công");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error("Cập nhật thất bại: " + (error.message || error));
    },
  });

  const form = useForm<UpdateTicketTypeSchemaType>({
    resolver: zodResolver(UpdateTicketTypeSchema),
    defaultValues: {
      tenLoaiVe,
      moTa: moTa || "",
      giaTien,
      soLuongPhatHanh,
      maLoaiVe,
    },
  });

  const onSubmit = (values: UpdateTicketTypeSchemaType) => {
    mutation.mutate({
      ...values,
      giaTien: Number(values.giaTien),
      soLuongPhatHanh: Number(values.soLuongPhatHanh),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cập nhật loại vé</AlertDialogTitle>
          <AlertDialogDescription>
            Thay đổi thông tin loại vé bên dưới.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="tenLoaiVe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại vé*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moTa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="giaTien"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá tiền (VNĐ)*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soLuongPhatHanh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng phát hành*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
              {mutation.isPending ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Hủy
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
