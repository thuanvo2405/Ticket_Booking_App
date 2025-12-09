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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AccountProfile = {
  manguoidung: string;
  tennguoidung: string;
  email: string;
  vaitro: "QUAN_TRI" | "TO_CHUC" | "KHACH_HANG";
  anhdaidien: string;
  ngaytao: string;
  is_active: boolean;
  isverified: boolean;
};

export default function AccountManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "admin" | "organizer" | "user">("all");
  const limit = 10;

  const roleFilter =
    tab === "admin"
      ? "QUAN_TRI"
      : tab === "organizer"
      ? "TO_CHUC"
      : tab === "user"
      ? "KHACH_HANG"
      : undefined;

  const { data } = useQuery({
    queryKey: ["users", page, roleFilter, search],
    queryFn: () => getUsersAPI(page, limit, roleFilter, search || undefined),
    placeholderData: (previous) => previous,
  });
  console.log(data);

  const queryClient = useQueryClient();

  const handleToggleStatus = useMutation({
    mutationFn: (manguoidung: string) => toggleUserStatusAPI(manguoidung),
    onSuccess: (data) => {
      toast.success(
        data?.is_active ? "Tài khoản đã được mở khóa" : "Tài khoản đã bị khóa"
      );
      queryClient.invalidateQueries({ queryKey: ["users", page] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Cập nhật trạng thái thất bại";
      toast.error(message);
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
      accessorKey: "isverified",
      header: "Xác thực",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            row.original.isverified
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.isverified ? "Đã xác thực" : "Chưa xác thực"}
        </span>
      ),
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

  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xl">Quản lý người dùng</p>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm tên hoặc email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <CreateUserModal />
        </div>
      </div>
      <div className="mt-3">
        <Tabs
          value={tab}
          onValueChange={(val) => {
            setTab(val as typeof tab);
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="organizer">Tổ chức</TabsTrigger>
            <TabsTrigger value="user">Người dùng</TabsTrigger>
          </TabsList>
        </Tabs>
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

        <div>
          Trang {page} / {totalPages || 1}
        </div>

        <Button
          variant="outline"
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
