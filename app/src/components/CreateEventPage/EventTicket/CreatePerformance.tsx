import { DateTimePicker24h } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreatePerformanceAPI } from "@/services/ticketService";
import { useEventStore } from "@/store/useEventStore";
import { formatDate } from "@/utils/convert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { maSuKien } = useEventStore();
  const queryClient = useQueryClient();

  const createPerformanceMutation = useMutation({
    mutationFn: ({ thoiGianBatDau, thoiGianKetThuc, maSuKien }: any) =>
      CreatePerformanceAPI(thoiGianBatDau, thoiGianKetThuc, maSuKien),
    onSuccess: () => {
      if (maSuKien) {
        queryClient.invalidateQueries({
          queryKey: ["fetchPerformance", maSuKien],
        });
      }
      toast.success("Tạo performance thành công");
      close();
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        if (backendMessage.includes("kết thúc phải sau thời gian bắt đầu")) {
          form.setError("thoiGianKetThuc", {
            type: "server",
            message: backendMessage,
          });
        } else {
          form.setError("thoiGianBatDau", {
            type: "server",
            message: backendMessage,
          });
        }
      } else {
        toast.error("Lỗi tạo performance: " + (error.message || error));
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createPerformanceMutation.mutate({
      thoiGianBatDau: formatDate(values.thoiGianBatDau),
      thoiGianKetThuc: formatDate(values.thoiGianKetThuc),
      maSuKien: maSuKien?.toString()!,
    });
  }

  return (
    <div className="w-11/12">
      <Card>
        <CardHeader>
          <CardTitle>Tạo suất diễn mới</CardTitle>
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
