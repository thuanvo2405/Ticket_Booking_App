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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createBankAccountAPI,
  getBankAccountByEventIDAPI,
  updateBankAccountAPI,
  updateEventStatusAPI,
} from "@/services/eventService";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const paymentSchema = z.object({
  tenChuSoHuu: z
    .string()
    .min(2, "Vui lòng nhập tên chủ sở hữu")
    .max(100, "Tên chủ sở hữu quá dài"),

  soTaiKhoan: z
    .string()
    .min(6, "Số tài khoản phải có ít nhất 6 chữ số")
    .max(20, "Số tài khoản quá dài")
    .regex(/^\d+$/, "Số tài khoản chỉ được chứa chữ số"),

  tenNganHang: z
    .string()
    .min(2, "Vui lòng chọn ngân hàng")
    .max(100, "Tên ngân hàng quá dài"),

  chiNhanh: z
    .string()
    .min(2, "Vui lòng nhập chi nhánh")
    .max(100, "Chi nhánh quá dài"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function EventPaymentSetup() {
  const [searchParams] = useSearchParams();
  const maSuKien = searchParams.get("eventId");

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      tenChuSoHuu: "",
      soTaiKhoan: "",
      tenNganHang: "",
      chiNhanh: "",
    },
  });

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const [open, setOpen] = React.useState(false);
  const banks = bankData.data;

  const onSelectBank = (val: string) => {
    form.setValue("tenNganHang", val);
    setOpen(false);
  };

  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["bankAccount", maSuKien],
    queryFn: () => getBankAccountByEventIDAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const handleUpdateStatusEvent = useMutation({
    mutationFn: () => updateEventStatusAPI(maSuKien!, "CHO_DUYET"),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["fetchProfileEventByOrganizerID"],
        exact: false,
      });
      toast.success("Sự kiện đã được gửi yêu cầu duyệt!");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    },
  });

  const handleBankAccount = useMutation({
    mutationFn: async (formData: PaymentFormValues) => {
      if (data?.mataikhoannganhang) {
        return updateBankAccountAPI(
          maSuKien!,
          formData.tenNganHang,
          formData.chiNhanh,
          formData.soTaiKhoan,
          formData.tenChuSoHuu
        );
      } else {
        return createBankAccountAPI(
          maSuKien!,
          formData.tenNganHang,
          formData.chiNhanh,
          formData.soTaiKhoan,
          formData.tenChuSoHuu
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccount", maSuKien] });
      toast.success("Thông tin thanh toán đã được lưu thành công!");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        tenChuSoHuu: data.tenchusohuu,
        soTaiKhoan: data.sotaikhoan,
        tenNganHang: data.tennganhang,
        chiNhanh: data.chinhanh,
      });
    }
  }, [data]);

  if (isFetching) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) =>
            handleBankAccount.mutate(formData)
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="tenNganHang"
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

          <FormField
            control={form.control}
            name="tenChuSoHuu"
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
            name="soTaiKhoan"
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
            name="chiNhanh"
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mt-3 w-full" variant="outline">
            Yêu cầu duyệt sự kiện
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yêu cầu duyệt sự kiện</AlertDialogTitle>
            <AlertDialogDescription>
              Khi sự kiện được yêu cầu duyệt, bạn sẽ không thể chỉnh sửa thông
              tin nữa. Vui lòng kiểm tra kỹ trước khi yêu cầu duyệt sự kiện.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleUpdateStatusEvent.mutate();
              }}
            >
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
