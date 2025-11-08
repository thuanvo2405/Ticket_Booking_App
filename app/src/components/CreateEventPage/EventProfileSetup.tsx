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
import province from "@/data/vietnam-provinces.json";
import { URL } from "@/constant/constant";
import { createEventAPI } from "@/services/eventService";
import toast from "react-hot-toast";
import { useEventStore } from "@/store/useEventStore";

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

const imageHandler = function (this: any) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(URL + "upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    const quill = this.quill;
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, "image", data.imageUrl);
  };
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["image"],
  ],
  handlers: {
    image: imageHandler,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "image",
];

export default function CreateEventInfoStep() {
  const [poster, setPoster] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const { setStep } = useEventStore();
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

  const city = form.watch("tinhThanh");
  const district = form.watch("quanHuyen");

  const selectedCity = province.find((c) => c.name === city);
  const districts = selectedCity?.districts || [];

  const selectedDistrict = districts.find((d) => d.name === district);
  const wards = selectedDistrict?.wards || [];

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    type === "poster" ? setPoster(file) : setBanner(file);
  };

  const onSubmit = async (data: EventForm) => {
    if (!poster || !banner) {
      toast.error("Vui lòng chọn đầy đủ hình ảnh!");
      return;
    }

    try {
      const res = await createEventAPI(
        data.tenSuKien,
        banner,
        poster,
        data.moTa ?? "",
        data.soNha,
        data.phuongXa,
        data.quanHuyen,
        data.tinhThanh
      );
      setStep(2);
      toast("Tạo sự kiện thành công", res);
    } catch (error) {
      toast.error("Lỗi tạo sự kiện:" + error);
    }
  };

  return (
    <div className="mx-auto px-8 py-10 space-y-8 overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Upload Image */}
          <div>
            <FormLabel className="text-base font-medium mb-2 block">
              Upload hình ảnh
            </FormLabel>
            <div className="grid grid-cols-7 gap-6">
              {/* Poster */}
              <div className="col-span-2 relative border-2 border-dashed border-gray-400 rounded-2xl h-[360px] flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition cursor-pointer overflow-hidden">
                <Label
                  htmlFor="poster-upload"
                  className="cursor-pointer w-full h-full"
                >
                  {poster ? (
                    <img
                      src={window.URL.createObjectURL(poster)}
                      alt="Poster"
                      className="object-contain w-full h-full rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full mx-auto">
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

              {/* Banner */}
              <div className="col-span-5 relative border-2 border-dashed border-gray-400 rounded-2xl h-[360px] flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition cursor-pointer overflow-hidden">
                <Label
                  htmlFor="banner-upload"
                  className="cursor-pointer w-full h-full"
                >
                  {banner ? (
                    <img
                      src={window.URL.createObjectURL(banner)}
                      alt="Banner"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full mx-auto">
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

          {/* Event name & type */}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại sự kiện" />
                    </SelectTrigger>
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

          {/* Location Selects */}
          <div className="space-y-3">
            <FormLabel>Địa chỉ sự kiện</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="tinhThanh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("quanHuyen", "");
                        form.setValue("phuongXa", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {province.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* District */}
              <FormField
                control={form.control}
                name="quanHuyen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      disabled={!city}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("phuongXa", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d.name} value={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ward */}
              <FormField
                control={form.control}
                name="phuongXa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <Select
                      disabled={!district}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((w) => (
                          <SelectItem key={w.name} value={w.name}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* House Number */}
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

          {/* Description */}
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
                  className="bg-white rounded-lg "
                  modules={modules}
                  formats={formats}
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
