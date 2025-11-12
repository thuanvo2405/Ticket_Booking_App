import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsAPI, updateEventStatusAPI } from "@/services/eventService";
import { useState } from "react";

export interface EventProfile {
  masukien: string;
  tensukien: string;
  mota: string;
  trangthai: "CHO_DUYET" | "DA_DUYET" | "HUY" | "NHAP" | "TU_CHOI";
  tentochuc: string;
  loaisukien: string;
}

export function TableEvent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["fetchingEvents", page, limit],
    queryFn: () => getEventsAPI({ page, limit }),
  });

  const mutation = useMutation({
    mutationFn: (maSuKien: string) =>
      updateEventStatusAPI(maSuKien, "DA_DUYET"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchingEvents", page, limit],
      });
    },
  });

  const columns: ColumnDef<EventProfile>[] = [
    {
      accessorKey: "tensukien",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sự kiện <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("tensukien")}</div>,
    },
    {
      accessorKey: "trangthai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const value = row.getValue("trangthai") as string;

        const colorMap: Record<string, string> = {
          CHO_DUYET: "text-yellow-600",
          DA_DUYET: "text-green-600",
          HUY: "text-red-600",
          TU_CHOI: "text-red-600",
          NHAP: "text-gray-500",
        };

        return (
          <span className={colorMap[value] || "text-black"}>
            {value.replaceAll("_", " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "tentochuc",
      header: "Tên tổ chức",
      cell: ({ row }) => <div>{row.getValue("tentochuc")}</div>,
    },
    {
      accessorKey: "tenloaisukien",
      header: "Loại sự kiện",
      cell: ({ row }) => <div>{row.getValue("tenloaisukien")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex gap-2">
            <EventProfileModal event={event} />
            <Button onClick={() => mutation.mutate(event.masukien)}>
              Duyệt
            </Button>
            <Button variant="destructive">Từ chối</Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
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
        <Select
          onValueChange={(value) => {
            table;
            table
              .getColumn("trangthai")
              ?.setFilterValue(value === "ALL" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="DANG_DIEN_RA">Đang diễn ra</SelectItem>
            <SelectItem value="DA_KET_THUC">Đã kết thúc</SelectItem>
            <SelectItem value="HUY">Hủy</SelectItem>
          </SelectContent>
        </Select>

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
