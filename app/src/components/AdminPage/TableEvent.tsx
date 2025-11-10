import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  VisibilityState,
  SortingState,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventProfileModal } from "./EventProfileModal";

export interface EventProfile {
  maSuKien: string;
  tenSuKien: string;
  moTa: string;
  trangThai: "DANG_DIEN_RA" | "DA_KET_THUC" | "HUY";
  tenToChuc: string;
  loaiSuKien: string;
}

const data: EventProfile[] = [
  {
    maSuKien: "e001",
    tenSuKien: "Hoạt động thể thao",
    moTa: "Giải bóng đá học sinh",
    trangThai: "DANG_DIEN_RA",
    tenToChuc: "CLB Thể Thao",
    loaiSuKien: "Thể thao",
  },
  {
    maSuKien: "e002",
    tenSuKien: "Hội thảo công nghệ",
    moTa: "Chia sẻ kiến thức về AI",
    trangThai: "DA_KET_THUC",
    tenToChuc: "Tech Group",
    loaiSuKien: "Hội thảo",
  },
  {
    maSuKien: "e003",
    tenSuKien: "Lễ hội âm nhạc",
    moTa: "Festival âm nhạc mùa hè",
    trangThai: "HUY",
    tenToChuc: "Music Org",
    loaiSuKien: "Âm nhạc",
  },
];

export const columns: ColumnDef<EventProfile>[] = [
  {
    accessorKey: "tenSuKien",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên sự kiện <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("tenSuKien")}</div>,
  },
  {
    accessorKey: "moTa",
    header: "Mô tả",
    cell: ({ row }) => <div>{row.getValue("moTa")}</div>,
  },
  {
    accessorKey: "trangThai",
    header: "Trạng thái",
    cell: ({ row }) => {
      const value = row.getValue("trangThai") as string;
      const color =
        value === "DANG_DIEN_RA"
          ? "text-green-600"
          : value === "DA_KET_THUC"
          ? "text-gray-600"
          : "text-red-600";
      return <div className={color}>{value.replaceAll("_", " ")}</div>;
    },
  },
  {
    accessorKey: "tenToChuc",
    header: "Tên tổ chức",
    cell: ({ row }) => <div>{row.getValue("tenToChuc")}</div>,
  },
  {
    accessorKey: "loaiSuKien",
    header: "Loại sự kiện",
    cell: ({ row }) => <div>{row.getValue("loaiSuKien")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex gap-2">
          <EventProfileModal />
          <Button>Duyệt</Button>
          <Button variant="destructive">Từ chối</Button>
        </div>
      );
    },
  },
];

export function TableEvent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
