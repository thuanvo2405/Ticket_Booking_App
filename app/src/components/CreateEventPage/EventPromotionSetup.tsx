import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import EventProMotioModal from "./EventPromotionModal";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePromotionAPI,
  getPromotionAPI,
} from "@/services/promotionService";
import { useSearchParams } from "react-router-dom";

type Promotion = {
  makhuyenmai: string;
  magiamgia: string;
  giatrigiam: number;
  loaigiam: "PHAN_TRAM" | "SO_TIEN";
  ngaybatdau: string;
  ngayketthuc: string;
  soluongphathanh: number;
  giatritoithieu: number;
};

export default function EventPromotionSetup() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchParams] = useSearchParams();
  const maSuKien = searchParams.get("eventId");
  const queryClient = useQueryClient();

  const { data = [] } = useQuery<Promotion[]>({
    queryKey: ["fetchPromotions", maSuKien],
    queryFn: () => getPromotionAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const handleEdit = (row: Promotion) => {
    console.log("Edit", row);
  };

  const handleDelete = useMutation({
    mutationFn: async (row: Promotion) => {
      await deletePromotionAPI(row.magiamgia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchPromotions", maSuKien],
      });
    },
  });

  const columns: ColumnDef<Promotion>[] = [
    { accessorKey: "magiamgia", header: "Mã giảm giá" },
    { accessorKey: "loaigiam", header: "Loại giảm" },
    { accessorKey: "giatrigiam", header: "Giá trị giảm" },
    { accessorKey: "giatritoithieu", header: "Giá trị tối thiểu" },
    {
      accessorKey: "ngaybatdau",
      header: "Ngày bắt đầu",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
    {
      accessorKey: "ngayketthuc",
      header: "Ngày kết thúc",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
    { accessorKey: "soluongphathanh", header: "Số lượng phát hành" },
    {
      id: "actions",
      header: "Hoạt động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete.mutate(row.original)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  });

  return (
    <div className="w-full p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Filter mã giảm giá..."
          value={
            (table.getColumn("magiamgia")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("magiamgia")?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />
        <EventProMotioModal />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Chưa có khuyến mãi nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center gap-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} khuyến mãi
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
