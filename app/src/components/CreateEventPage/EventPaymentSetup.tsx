import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const paymentSchema = z.object({
  ownerName: z.string().min(2, "Vui lòng nhập tên chủ sở hữu"),
  accountNumber: z.string().min(5, "Vui lòng nhập mã tài khoản"),
  bankName: z.string().min(2, "Vui lòng nhập tên ngân hàng"),
  branch: z.string().min(2, "Vui lòng nhập chi nhánh"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function EventPaymentSetup() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      ownerName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    console.log("Payment info:", values);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Thông tin thanh toán</h1>
      <h3 className="text-sm text-muted-foreground mb-6">
        Chúng tôi sẽ thanh toán sau 7 - 10 ngày sau khi sự kiện kết thúc
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên chủ sở hữu</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyen Van A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên ngân hàng</FormLabel>
                <FormControl>
                  <Input placeholder="Ngân hàng ABC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh</FormLabel>
                <FormControl>
                  <Input placeholder="Chi nhánh Hà Nội" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Lưu thông tin
          </Button>
        </form>
      </Form>
    </div>
  );
}
