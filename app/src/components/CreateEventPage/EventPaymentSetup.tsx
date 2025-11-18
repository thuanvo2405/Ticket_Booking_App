import * as React from "react";
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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import bankData from "@/data/vietnam-bank.json";

const paymentSchema = z.object({
  ownerName: z.string().min(2, "Vui lòng nhập tên chủ sở hữu"),
  accountNumber: z.string().min(5, "Vui lòng nhập mã tài khoản"),
  bankName: z.string().min(2, "Vui lòng chọn ngân hàng"),
  branch: z.string().optional(),
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

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const [open, setOpen] = React.useState(false);
  const banks = bankData.data;

  const onSelectBank = (val: string) => {
    form.setValue("bankName", val);
    setOpen(false);
  };

  const onSubmit = (data: PaymentFormValues) => {
    console.log("Payment info:", data);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngân hàng</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        ref={triggerRef}
                      >
                        {field.value
                          ? banks.find((b) => b.shortName === field.value)
                              ?.shortName
                          : "Chọn ngân hàng..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      side="bottom"
                      align="start"
                      alignOffset={0}
                      collisionPadding={0}
                      style={{ width: triggerRef.current?.offsetWidth }}
                    >
                      <Command>
                        <CommandInput
                          placeholder="Tìm ngân hàng..."
                          className="h-9"
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>Không tìm thấy ngân hàng</CommandEmpty>
                          <CommandGroup>
                            {banks.map((bank) => (
                              <CommandItem
                                key={bank.id}
                                value={bank.shortName}
                                onSelect={() => onSelectBank(bank.shortName)}
                                className="flex items-center gap-2 px-3 py-3 hover:bg-accent/50 rounded-md cursor-pointer"
                              >
                                <img
                                  src={bank.logo}
                                  alt={bank.shortName}
                                  className="w-20 h-8 rounded"
                                />
                                <span>{bank.shortName}</span>
                                {field.value === bank.shortName && (
                                  <Check className="ml-auto h-4 w-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tên chủ sở hữu */}
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên chủ sở hữu</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Nguyen Van A"
                  />
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
                <FormLabel>Số tài khoản</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="0123456789"
                  />
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
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Chi nhánh Hà Nội"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Lưu
          </Button>
        </form>
      </Form>
    </div>
  );
}
