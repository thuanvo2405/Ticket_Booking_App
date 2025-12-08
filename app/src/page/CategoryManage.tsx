import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { CategoryFormDialog } from "@/components/AdminPage/CategoryFormDialog";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {
  type EventCategory,
  deleteAdminCategoryAPI,
  getAdminCategoriesAPI,
} from "@/services/categoryService";
import { useState } from "react";

type DeleteDialogProps = {
  category: EventCategory;
  onConfirm: () => void;
  isLoading: boolean;
};

function DeleteCategoryDialog({
  category,
  onConfirm,
  isLoading,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700"
        >
          <span className="flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            Xóa
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa loại sự kiện?</AlertDialogTitle>
          <AlertDialogDescription>
            Loại sự kiện "{category.tenloaisukien}" sẽ bị xóa. Hệ thống sẽ không
            cho phép xóa nếu đang có sự kiện sử dụng loại này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xóa...
              </span>
            ) : (
              "Xóa"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function CategoryManage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: getAdminCategoriesAPI,
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => deleteAdminCategoryAPI(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success("Xóa loại sự kiện thành công");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Không thể xóa loại sự kiện"
      );
    },
    onSettled: () => setDeletingId(null),
  });

  const columns: ColumnDef<EventCategory>[] = [
    {
      accessorKey: "tenloaisukien",
      header: "Tên loại sự kiện",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("tenloaisukien")}</div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <CategoryFormDialog
            mode="edit"
            category={row.original}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["adminCategories"] })
            }
          />
          <DeleteCategoryDialog
            category={row.original}
            onConfirm={() => deleteCategory.mutate(row.original.maloaisukien)}
            isLoading={
              deleteCategory.isPending &&
              deletingId === row.original.maloaisukien
            }
          />
        </div>
      ),
    },
  ];

  const totalCategories = data?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold">Quản lý loại sự kiện</p>
          <p className="text-sm text-gray-600">
            Tối đa 10 loại sự kiện. Xóa bớt nếu muốn thêm loại mới.
          </p>
        </div>
        <CategoryFormDialog
          mode="create"
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] })
          }
          disabled={totalCategories >= 10}
        />
      </div>

      {totalCategories >= 10 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Đã đạt giới hạn 10 loại sự kiện. Vui lòng xóa một loại trước khi thêm
          mới.
        </div>
      )}

      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        {isFetching && (
          <div className="text-sm text-gray-500 mb-2">
            Đang tải danh sách loại sự kiện...
          </div>
        )}
        <DataTable columns={columns} data={data || []} />
      </div>
    </div>
  );
}
