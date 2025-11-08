import { DateTimePicker24h } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronDown, Ellipsis, Pencil, Ticket, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const eventSchema = z.object({
  thoiGianBatDau: z.date(),
  thoiGianKetThuc: z.date(),
});

type EventForm = z.infer<typeof eventSchema>;

export default function MenuTicket() {
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {},
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="bg-black/5 rounded-md">
        <AccordionTrigger className="w-full">
          <div className="flex justify-between items-center px-2 w-full">
            <div className="flex items-center gap-4">
              <div>
                <p>Thời gian suất</p>
                <p className="text-sm">1 Loại vé</p>
              </div>
            </div>
            <Button>
              <Ellipsis />
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
          <h3>Loại vé</h3>
          <ul className="flex  flex-col gap-3">
            <li className="bg-black/10 flex items-center justify-between p-2 rounded-lg">
              <div className="flex gap-2 items-center">
                <Ticket />
                <p>Tên hạng vé</p>
              </div>
              <div className="flex gap-2 items-center">
                <Button size="sm">
                  <Pencil />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 />
                </Button>
              </div>
            </li>
            <li className="bg-black/10 flex items-center justify-between p-2 rounded-lg">
              <div className="flex gap-2 items-center">
                <Ticket />
                <p>Tên hạng vé</p>
              </div>
              <div className="flex gap-2 items-center">
                <Button size="sm">
                  <Pencil />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 />
                </Button>
              </div>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
