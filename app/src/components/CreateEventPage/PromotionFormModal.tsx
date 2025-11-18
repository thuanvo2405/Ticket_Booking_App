import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker24h } from "@/components/date-time-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// === Schema ===
const PromotionFormSchema = z
  .object({
    maGiamGia: z.string().min(1),
    loaiGiam: z.enum(["PHAN_TRAM", "SO_TIEN"]),
    giaTriGiam: z.number().min(1),
    ngayBatDau: z.date(),
    ngayKetThuc: z.date(),
    soLuongPhatHanh: z.number().min(1),
    giaTriToiThieu: z.number().min(1),
    maSuKien: z.string(),
  })
  .refine((data) => data.ngayKetThuc > data.ngayBatDau, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["ngayKetThuc"],
  });

const createPromotionAPI = async (data: any) => {
  const res = await fetch("/api/promotions", {
    method: data.id ? "PUT" : "POST", // nếu có id => edit
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

interface PromotionFormModalProps {
  close: () => void;
  defaultValues?: any;
}

export default function PromotionFormModal({
  close,
  defaultValues,
}: PromotionFormModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof PromotionFormSchema>>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: defaultValues || { loaiGiam: "SO_TIEN" },
  });

  const mutation = useMutation({
    mutationFn: createPromotionAPI,
    onSuccess: () => {
      toast.success(
        defaultValues ? "Cập nhật thành công" : "Tạo khuyến mãi thành công"
      );
      queryClient.invalidateQueries(["promotions"]);
      close();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const onSubmit = (values: any) => {
    if (defaultValues?.id) values.id = defaultValues.id;
    mutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-2xl rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {defaultValues ? "Sửa khuyến mãi" : "Tạo khuyến mãi"}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <FormField
              name="maGiamGia"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã giảm giá</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* các field khác tương tự: loaiGiam, giaTriGiam, giaTriToiThieu, soLuongPhatHanh, ngayBatDau, ngayKetThuc, maSuKien */}
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <Button type="submit">
                {defaultValues ? "Cập nhật" : "Tạo"}
              </Button>
              <Button type="button" variant="outline" onClick={close}>
                Đóng
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
