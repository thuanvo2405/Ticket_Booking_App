import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const eventSchema = z.object({
  tenSuKien: z.string().min(1, "Vui lòng nhập tên sự kiện"),
  loaiSuKien: z.string().min(1, "Vui lòng chọn loại sự kiện"),
  tinhThanh: z.string().min(1, "Vui lòng chọn Tỉnh/Thành"),
  quanHuyen: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  phuongXa: z.string().min(1, "Vui lòng chọn Phường/Xã"),
  soNha: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  moTa: z.string().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventInfoStep() {
  const [poster, setPoster] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      tenSuKien: "",
      loaiSuKien: "",
      tinhThanh: "",
      quanHuyen: "",
      phuongXa: "",
      soNha: "",
      moTa: "",
    },
  });

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    type === "poster" ? setPoster(file) : setBanner(file);
  };

  const onSubmit = (data: EventForm) => {
    console.log({ ...data, poster, banner });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Upload hình ảnh */}
          <div>
            <FormLabel className="text-base font-medium mb-2 block">
              Upload hình ảnh
            </FormLabel>
            <div className="grid grid-cols-2 gap-6">
              {/* Ảnh dọc (Poster) */}
              <div className="relative border-2 border-dashed border-gray-400 rounded-2xl h-[360px] flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition cursor-pointer overflow-hidden">
                <Label
                  htmlFor="poster-upload"
                  className="cursor-pointer w-full h-full"
                >
                  {poster ? (
                    <img
                      src={URL.createObjectURL(poster)}
                      alt="Poster"
                      className="object-contain w-full h-full rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-gray-400 font-medium">
                        Thêm ảnh sự kiện
                      </p>
                      <p className="text-xs text-gray-500">(720x958)</p>
                    </div>
                  )}
                </Label>
                <input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, "poster")}
                />
              </div>

              {/* Ảnh ngang (Banner) */}
              <div className="relative border-2 border-dashed border-gray-400 rounded-2xl h-[360px] flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition cursor-pointer overflow-hidden">
                <Label
                  htmlFor="banner-upload"
                  className="cursor-pointer w-full h-full"
                >
                  {banner ? (
                    <img
                      src={URL.createObjectURL(banner)}
                      alt="Banner"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-gray-400 font-medium">
                        Thêm ảnh nền sự kiện
                      </p>
                      <p className="text-xs text-gray-500">(1280x720)</p>
                    </div>
                  )}
                </Label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, "banner")}
                />
              </div>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tenSuKien"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sự kiện</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên sự kiện" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loaiSuKien"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thể loại sự kiện</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại sự kiện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amnhac">Âm nhạc</SelectItem>
                      <SelectItem value="hoithao">Hội thảo</SelectItem>
                      <SelectItem value="trienlam">Triển lãm</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Địa chỉ */}
          <div className="space-y-3">
            <FormLabel>Địa chỉ sự kiện</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tinhThanh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quanHuyen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quan1">Quận 1</SelectItem>
                        <SelectItem value="quan3">Quận 3</SelectItem>
                        <SelectItem value="quan7">Quận 7</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phuongXa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="p1">Phường 1</SelectItem>
                        <SelectItem value="p2">Phường 2</SelectItem>
                        <SelectItem value="p3">Phường 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soNha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số nhà, đường</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 123 Lê Lợi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Mô tả sự kiện */}
          <div className="space-y-3">
            <FormLabel>Giới thiệu sự kiện</FormLabel>
            <Controller
              name="moTa"
              control={form.control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white rounded-lg"
                />
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t mt-10">
            <Button type="button" variant="outline" className="w-32">
              Lưu
            </Button>
            <Button type="submit" className="w-32">
              Tiếp tục
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
