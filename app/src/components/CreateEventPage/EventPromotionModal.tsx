import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { formatDate } from "@/utils/convert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateTimePicker24h } from "../date-time-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  CreatePromotionAPI,
  updatePromotionAPI,
} from "@/services/promotionService";
import { useSearchParams } from "react-router-dom";
import type { Promotion } from "./EventPromotionSetup";

export const PromotionFormSchema = z
  .object({
    maGiamGia: z.string().trim().min(1, "Mã giảm giá là bắt buộc"),
    giaTriGiam: z.number().min(1, "Giá trị giảm phải lớn hơn 0"),
    loaiGiam: z.enum(["PHAN_TRAM", "SO_TIEN"]),
    ngayBatDau: z.date(),
    ngayKetThuc: z.date(),
    soLuongPhatHanh: z.number().min(1, "Số lượng phải lớn hơn 0"),
    giaTriToiThieu: z.number().min(1, "Giá trị tối thiểu phải lớn hơn 0"),
  })
  .refine((data) => data.ngayKetThuc > data.ngayBatDau, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["ngayKetThuc"],
  })
  .refine(
    (data) => (data.loaiGiam === "PHAN_TRAM" ? data.giaTriGiam <= 100 : true),
    {
      message: "Giảm theo phần trăm phải ≤ 100%",
      path: ["giaTriGiam"],
    }
  )
  .refine(
    (data) =>
      data.loaiGiam === "SO_TIEN"
        ? data.giaTriGiam <= data.giaTriToiThieu
        : true,
    {
      message: "Giá trị giảm không thể lớn hơn giá trị tối thiểu áp dụng",
      path: ["giaTriGiam"],
    }
  );

export type PromotionFormValues = z.infer<typeof PromotionFormSchema>;

export default function EventPromotionModal({
  promotion,
  onClose,
}: {
  promotion?: Promotion | null;
  onClose?: () => void;
}) {
  const [searchParams] = useSearchParams();
  const maSuKien = searchParams.get("eventId");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [amountValue, setAmountValue] = useState(10000);
  const [percentValue, setPercentValue] = useState(10);

  useEffect(() => {
    if (promotion) {
      setOpen(true);
    }
  }, [promotion]);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: {
      maGiamGia: "",
      giaTriGiam: 10000,
      loaiGiam: "SO_TIEN",
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(),
      soLuongPhatHanh: 1,
      giaTriToiThieu: 10000,
    },
  });

  useEffect(() => {
    if (promotion) {
      form.reset({
        maGiamGia: promotion.magiamgia,
        giaTriGiam: Number(promotion.giatrigiam),
        loaiGiam: promotion.loaigiam,
        ngayBatDau: new Date(promotion.ngaybatdau),
        ngayKetThuc: new Date(promotion.ngayketthuc),
        soLuongPhatHanh: promotion.soluongphathanh,
        giaTriToiThieu: Number(promotion.giatritoithieu),
      });
    }
  }, [promotion]);

  const loaiGiam = form.watch("loaiGiam");

  useEffect(() => {
    if (loaiGiam === "SO_TIEN") {
      form.setValue("giaTriGiam", amountValue);
    } else {
      form.setValue("giaTriGiam", percentValue);
    }
  }, [loaiGiam]);

  const createPromotionMutation = useMutation({
    mutationFn: ({
      maGiamGia,
      giaTriGiam,
      loaiGiam,
      ngayBatDau,
      ngayKetThuc,
      soLuongPhatHanh,
      giaTriToiThieu,
      maSuKien,
    }: any) =>
      CreatePromotionAPI(
        maGiamGia,
        giaTriGiam,
        loaiGiam,
        ngayBatDau,
        ngayKetThuc,
        soLuongPhatHanh,
        giaTriToiThieu,
        maSuKien
      ),
    onSuccess: () => {
      toast.success("Tạo khuyến mãi thành công");
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["fetchPromotions", maSuKien],
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        "Lỗi tạo khuyến mãi: " + (error?.response?.data?.message || error)
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      updatePromotionAPI(
        promotion!.makhuyenmai,
        values.maGiamGia,
        values.giaTriGiam,
        values.loaiGiam,
        values.ngayBatDau,
        values.ngayKetThuc,
        values.soLuongPhatHanh,
        values.giaTriToiThieu
      ),
    onSuccess: () => {
      toast.success("Cập nhật khuyến mãi thành công");
      queryClient.invalidateQueries({
        queryKey: ["fetchPromotions", maSuKien],
      });
      form.reset();
      setOpen(false);
      onClose?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Cập nhật khuyến mãi không thành công"
      );
    },
  });

  const onSubmit = (values: PromotionFormValues) => {
    if (!maSuKien) {
      toast.error("Thiếu mã sự kiện, vui lòng tải lại trang");
      return;
    }

    if (promotion) {
      updateMutation.mutate({
        maKhuyenMai: promotion.makhuyenmai,
        maGiamGia: values.maGiamGia,
        giaTriGiam: values.giaTriGiam,
        loaiGiam: values.loaiGiam,
        ngayBatDau: formatDate(values.ngayBatDau),
        ngayKetThuc: formatDate(values.ngayKetThuc),
        soLuongPhatHanh: values.soLuongPhatHanh,
        giaTriToiThieu: values.giaTriToiThieu,
      });
    } else {
      createPromotionMutation.mutate({
        maGiamGia: values.maGiamGia,
        giaTriGiam: values.giaTriGiam,
        loaiGiam: values.loaiGiam,
        soLuongPhatHanh: values.soLuongPhatHanh,
        giaTriToiThieu: values.giaTriToiThieu,
        ngayBatDau: formatDate(values.ngayBatDau),
        ngayKetThuc: formatDate(values.ngayKetThuc),
        maSuKien,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm khuyến mãi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Thêm khuyến mãi</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maGiamGia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã giảm giá</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập mã giảm giá" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="loaiGiam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại giảm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PHAN_TRAM">Phần trăm</SelectItem>
                          <SelectItem value="SO_TIEN">Số tiền</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Số lượng phát hành</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="giaTriGiam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giá trị giảm {loaiGiam === "PHAN_TRAM" ? "(%)" : "(VNĐ)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={
                          Number.isFinite(field.value)
                            ? field.value.toLocaleString("vi-VN")
                            : ""
                        }
                        placeholder={
                          loaiGiam === "PHAN_TRAM"
                            ? "Ví dụ: 10"
                            : "Ví dụ: 10.000"
                        }
                        onChange={(e) => {
                          const raw =
                            Number(e.target.value.replace(/\D/g, "")) || 0;
                          field.onChange(raw);

                          if (loaiGiam === "SO_TIEN") {
                            setAmountValue(raw);
                          } else {
                            setPercentValue(raw);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="giaTriToiThieu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị tối thiểu áp dụng</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={
                          Number.isFinite(field.value)
                            ? field.value.toLocaleString("vi-VN")
                            : ""
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          field.onChange(Number(raw) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ngayBatDau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ngayKetThuc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit">{promotion ? "Sửa" : "Tạo"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
