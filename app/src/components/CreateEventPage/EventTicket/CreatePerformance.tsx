import { DateTimePicker24h } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
  FormMessage,
} from "@/components/ui/form";
import { CreatePerformanceAPI } from "@/services/ticketService";
import { formatDate } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  thoiGianBatDau: z.date(),
  thoiGianKetThuc: z.date(),
});

export interface CreatePerformance {
  close: () => void;
}

export default function CreatePerformance({ close }: CreatePerformance) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await CreatePerformanceAPI(
        formatDate(values.thoiGianBatDau),
        formatDate(values.thoiGianKetThuc),
        "9c13895f-daf4-4278-b691-5b49b070dbc1"
      );
      close();
      toast("Tạo sự kiện thành công", res);
    } catch (error) {
      toast.error("Lỗi tạo sự kiện:" + error);
    }
  }
  return (
    <div className="w-11/12">
      <Card>
        <CardHeader>
          <CardTitle>Tạo loại vé mới</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="thoiGianBatDau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <DateTimePicker24h
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thoiGianKetThuc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <DateTimePicker24h
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center gap-2">
                <Button type="submit">Tạo</Button>
                <Button type="button" onClick={close}>
                  Đóng
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
