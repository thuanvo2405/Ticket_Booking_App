import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createOrganizerProfileAPI } from "@/services/organizerService";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

const formSchema = z.object({
  tenToChuc: z.string().min(2, "Tên tổ chức phải có ít nhất 2 ký tự"),
  anhToChuc: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Vui lòng chọn ảnh tổ chức")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Ảnh phải là PNG hoặc JPG"
    ),
  moTa: z.string().min(0),
});

export default function CreateOrganizer() {
  const [preview, setPreview] = useState<string | null>(null);
  const { updateUserAndToken } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: createProfile, isPending } = useMutation({
    mutationFn: ({ tenToChuc, moTa, anhToChuc }: z.infer<typeof formSchema>) =>
      createOrganizerProfileAPI(moTa, anhToChuc, tenToChuc),

    onSuccess: ({ data }: any) => {
      const { user, tokens } = data;
      updateUserAndToken(user, tokens);
      toast.success("Tạo hồ sơ tổ chức thành công 🎉");
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Tạo hồ sơ thất bại 😢");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProfile(values);
  }

  if (isPending) return <h1>Loading</h1>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-3xl w-full border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 uppercase">
          Tạo hồ sơ tổ chức của bạn
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 animate-fadeIn"
          >
            <FormField
              control={form.control}
              name="tenToChuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Tên tổ chức
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Công ty Tổ Chức Sự Kiện Ánh Dương"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="anhToChuc"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Ảnh tổ chức
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-4">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Xem trước ảnh tổ chức"
                          className="w-40 h-40 rounded-xl object-cover shadow-md border"
                        />
                      ) : (
                        <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moTa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Giới thiệu về tổ chức
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hãy giới thiệu ngắn gọn về lĩnh vực hoạt động, quy mô hoặc sứ mệnh của tổ chức..."
                      className="min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-8 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 transition-all"
              >
                Tạo hồ sơ
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
