"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
import { IMAGE_URL } from "@/constant/constant";
import { updateOrganizerProfileAPI } from "@/services/organizerService";
import toast from "react-hot-toast";

interface OrganizerFormValues {
  tentochuc: string;
  mota: string;
  anhtochuc?: File;
}

export default function EditOrganizer({ data, refetch }: any) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<OrganizerFormValues>({
    defaultValues: {
      tentochuc: data.tentochuc,
      mota: data.mota,
    },
  });

  const onSubmit = async (values: OrganizerFormValues) => {
    const tentochuc = values.tentochuc.trim();
    const mota = values.mota.trim();
    const anhtochuc = values.anhtochuc || undefined;

    const nothingChanged =
      tentochuc === data.tentochuc && mota === data.mota && !anhtochuc;

    if (nothingChanged) {
      toast("Không có thay đổi nào!", { icon: "ℹ️" });
      return setOpen(false);
    }

    try {
      await updateOrganizerProfileAPI(tentochuc, mota, anhtochuc);
      toast.success("Cập nhật thành công!");
      setOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="px-4">
          Chỉnh sửa hồ sơ
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-lg border border-gray-200 shadow-xl rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Chỉnh sửa hồ sơ tổ chức
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-2"
          >
            {/* Tên tổ chức */}
            <FormField
              control={form.control}
              name="tentochuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Tên tổ chức</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border rounded-lg focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Giới thiệu */}
            <FormField
              control={form.control}
              name="mota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Giới thiệu</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border rounded-lg focus:ring-2 h-28"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ảnh tổ chức */}
            <FormField
              control={form.control}
              name="anhtochuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Ảnh tổ chức</FormLabel>

                  <FormControl>
                    <div className="flex flex-col items-center">
                      <div
                        onClick={() =>
                          document.getElementById("fileInputHidden")?.click()
                        }
                        className="w-40 h-40 rounded-xl border border-gray-300 overflow-hidden cursor-pointer 
                       bg-gray-100 shadow-sm flex items-center justify-center hover:opacity-80 duration-150"
                      >
                        <img
                          src={preview || IMAGE_URL + data.anhtochuc}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <input
                        id="fileInputHidden"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);

                          if (file) {
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="flex gap-3 justify-end mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>

              <Button type="submit" className="rounded-lg">
                Cập nhật
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
