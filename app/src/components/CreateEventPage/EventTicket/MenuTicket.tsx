import { DateTimePicker24h } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil, Plus, Ticket, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, formatDateTime } from "@/utils/convert";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePerformaneAPI,
  deleteTicketTypeAPI,
  getTicketTypeAPI,
  updatePerformanceAPI,
} from "@/services/ticketService";
import toast from "react-hot-toast";
import { useEventStore } from "@/store/useEventStore";
import CreateTicketType from "./CreateTicketType";

const eventSchema = z.object({
  thoiGianBatDau: z.date(),
  thoiGianKetThuc: z.date(),
});

type EventForm = z.infer<typeof eventSchema>;

export interface MenuTicketProps {
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  masuatdien: string;
}

export default function MenuTicket({
  thoiGianBatDau,
  thoiGianKetThuc,
  masuatdien,
}: MenuTicketProps) {
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      thoiGianBatDau: new Date(thoiGianBatDau),
      thoiGianKetThuc: new Date(thoiGianKetThuc),
    },
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const queryClient = useQueryClient();
  const { maSuKien } = useEventStore();

  const { data, isFetching } = useQuery({
    queryKey: ["fetchTicketType", masuatdien],
    queryFn: () => getTicketTypeAPI(masuatdien!),
    enabled: !!masuatdien,
  });

  const deletePerformance = useMutation({
    mutationFn: () => deletePerformaneAPI(masuatdien),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchPerformance", maSuKien],
      });
      toast.success("Xóa performance thành công");
      close();
    },
    onError: (error: any) => {
      toast.error("Lỗi xóa performance: " + (error.message || error));
    },
  });

  const deleteTicketType = useMutation({
    mutationFn: (maLoaiVe: string) => deleteTicketTypeAPI(maLoaiVe),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchTicketType", masuatdien],
      });
      toast.success("Xóa loại vé thành công");
    },
    onError: (error: any) => {
      toast.error("Lỗi xóa loại vé: " + (error.message || error));
    },
  });

  const updatePerformanceMutation = useMutation({
    mutationFn: ({
      masuatdien,
      thoiGianBatDau,
      thoiGianKetThuc,
    }: {
      masuatdien: string;
      thoiGianBatDau: string;
      thoiGianKetThuc: string;
    }) => updatePerformanceAPI(masuatdien, thoiGianBatDau, thoiGianKetThuc),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchPerformance", maSuKien],
      });
      toast.success("Cập nhật suất diễn thành công");
    },
    onError: (error: any) => {
      toast.error("Lỗi cập nhật: " + (error?.response?.data?.message || error));
    },
  });

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="bg-black/5 rounded-md">
          <AccordionTrigger className="w-full">
            <div className="flex justify-between items-center px-2 w-full">
              <div className="flex items-center gap-4">
                <div>
                  <p>
                    {formatDateTime(thoiGianBatDau) +
                      " - " +
                      formatDateTime(thoiGianKetThuc)}
                  </p>
                  <p className="text-sm">{data.length} Loại vé</p>
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenConfirm(true);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance px-2">
            <div className="grid grid-cols-2 gap-6">
              <Form {...form}>
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
              </Form>
            </div>
            <Button
              className="w-full"
              onClick={form.handleSubmit((values) => {
                updatePerformanceMutation.mutate({
                  masuatdien,
                  thoiGianBatDau: formatDate(values.thoiGianBatDau),
                  thoiGianKetThuc: formatDate(values.thoiGianKetThuc),
                });
              })}
            >
              Cập nhật thời gian
            </Button>
            <h3>Loại vé</h3>
            <ul className="flex  flex-col gap-3">
              {data.map((item: any) => (
                <li
                  className="bg-black/10 flex items-center justify-between p-2 rounded-lg"
                  key={item.masuatdien}
                >
                  <div className="flex gap-2 items-center">
                    <Ticket />
                    <p>{item.tenloaive}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                      <Button size="sm">
                        <Pencil />
                      </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTicketType.mutate(item.maloaive)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="default"
              className="text-green-500 hover:bg-foreground/5 text-lg"
              onClick={() => setOpenCreateTicket((prev) => !prev)}
            >
              <Plus />
              Tạo loại vé
            </Button>
            {openCreateTicket && (
              <CreateTicketType maSuatDien={masuatdien.toString()} />
            )}
          </AccordionContent>
          <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc muốn xóa suất diễn này?
                </AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenConfirm(false)}>
                  Hủy
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    deletePerformance.mutate();
                    setOpenConfirm(false);
                  }}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
