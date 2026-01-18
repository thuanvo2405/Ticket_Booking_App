import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketTypeAPI } from "@/services/ticketService";
import toast from "react-hot-toast";

const TicketSchema = z.object({
  tenLoaiVe: z.string().min(1, "Tên loại vé là bắt buộc"),
  moTa: z.string().optional(),
  giaTien: z
    .number({ message: "Giá tiền phải là số" })
    .min(1, "Giá tiền phải lớn hơn 0"),
  soLuongPhatHanh: z
    .number({ message: "Số lượng phải là số" })
    .min(1, "Số lượng phải lớn hơn 0"),
});

type TicketSchemaType = z.infer<typeof TicketSchema>;

interface CreateTicketTypeProps {
  maSuatDien: string;
}

export default function CreateTicketType({
  maSuatDien,
}: CreateTicketTypeProps) {
  const queryClient = useQueryClient();
  const createTicketTypeMutation = useMutation({
    mutationFn: ({
      tenLoaiVe,
      moTa,
      giaTien,
      soLuongPhatHanh,
      maSuatDien,
    }: any) =>
      createTicketTypeAPI(
        tenLoaiVe,
        moTa,
        giaTien,
        soLuongPhatHanh,
        maSuatDien,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({});
      toast.success("Tạo loại vé thành công");
    },
    onError: (error: any) => {
      toast.error("Lỗi tạo loại vé: " + (error.message || error));
    },
  });
  const form = useForm<TicketSchemaType>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      tenLoaiVe: "",
      moTa: "",
      giaTien: 0,
      soLuongPhatHanh: 1,
    },
  });

  const onSubmit = (values: TicketSchemaType) => {
    createTicketTypeMutation.mutate({
      tenLoaiVe: values.tenLoaiVe,
      moTa: values.moTa,
      giaTien: values.giaTien,
      soLuongPhatHanh: values.soLuongPhatHanh,
      maSuatDien,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo loại vé mới</CardTitle>
        <CardDescription>Thêm loại vé cho sự kiện của bạn</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="tenLoaiVe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại vé*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Vé VIP" {...field} />
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
                    <Textarea
                      placeholder="Mô tả quyền lợi, vị trí ngồi..."
                      {...field}
                    />
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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

            <Button type="submit" className="w-full">
              Tạo loại vé
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
