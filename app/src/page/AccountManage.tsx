import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { toggleUserStatusAPI, getUsersAPI } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ColumnDef } from "@tanstack/react-table";
import { IMAGE_URL } from "@/constant/constant";
import { formatDateTime } from "@/utils/convert";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import toast from "react-hot-toast";
import CreateUserModal from "@/components/AdminPage/CreateUserModal";
import { useState } from "react";
import UpdateUserModal from "@/components/AdminPage/UpdateUserModal";

export type AccountProfile = {
  manguoidung: string;
  tennguoidung: string;
  email: string;
  vaitro: "QUAN_TRI" | "TO_CHUC" | "KHACH_HANG";
  anhdaidien: string;
  ngaytao: string;
  is_active: boolean;
};

export default function AccountManage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsersAPI(page),
    placeholderData: (previous) => previous,
  });
  console.log(data);

  const queryClient = useQueryClient();

  const handleToggleStatus = useMutation({
    mutationFn: (manguoidung: string) => toggleUserStatusAPI(manguoidung),
    onSuccess: (data) => {
      toast.success(
        data?.status ? "Tài khoản đã được mở khóa" : "Tài khoản đã bị khóa"
      );
      queryClient.invalidateQueries({ queryKey: ["users", page] });
    },
    onError: () => {
      toast.error("Cập nhật trạng thái thất bại");
    },
  });

  const columns: ColumnDef<AccountProfile>[] = [
    {
      accessorKey: "tennguoidung",
      header: () => <div className="text-left">Tên người dùng</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={IMAGE_URL + row.original.anhdaidien}
            alt={row.original.tennguoidung}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{row.original.tennguoidung}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
    },
    {
      accessorKey: "vaitro",
      header: () => <div>Vai trò</div>,
      cell: ({ row }) => {
        if (row.getValue("vaitro") === "QUAN_TRI")
          return (
            <div className="text-white   bg-red-500 font-medium rounded-xl px-2 py-1 inline-block ">
              Quản trị viên
            </div>
          );
        if (row.getValue("vaitro") === "TO_CHUC")
          return (
            <div className="text-white   bg-yellow-500 font-medium rounded-xl px-2 py-1 inline-block">
              Tổ chức
            </div>
          );
        if (row.getValue("vaitro") === "KHACH_HANG")
          return (
            <div className="text-white   bg-green-500 font-medium rounded-xl px-2 py-1 inline-block">
              Người dùng
            </div>
          );
      },
    },
    {
      accessorKey: "ngaytao",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const ngaytao = row.getValue("ngaytao") as string;
        const format = formatDateTime(ngaytao);
        return <div className="center">{format}</div>;
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <UpdateUserModal
            user={{
              manguoidung: row.original.manguoidung,
              tennguoidung: row.original.tennguoidung,
              email: row.original.email,
              vaitro: row.original.vaitro as
                | "QUAN_TRI"
                | "TO_CHUC"
                | "KHACH_HANG",
            }}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["users", page] })
            }
          />

          <ConfirmDialog
            title={
              row.original.is_active ? "Khóa tài khoản?" : "Mở khóa tài khoản?"
            }
            description={
              row.original.is_active
                ? "Tài khoản này sẽ bị KHÓA và không thể đăng nhập."
                : "Mở khóa tài khoản để người dùng sử dụng lại."
            }
            onConfirm={() =>
              handleToggleStatus.mutate(row.original.manguoidung)
            }
            confirmText={row.original.is_active ? "Khóa" : "Mở khóa"}
            cancelText="Hủy"
            isActive={row.original.is_active}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xl">Quản lý người dùng</p>
        <CreateUserModal />
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={data?.data || []} />
      </div>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <div>Trang {page}</div>

        <Button
          variant="outline"
          onClick={() =>
            setPage((p) => (p * limit < (data?.total ?? 0) ? p + 1 : p))
          }
          disabled={page * limit >= (data?.total ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
