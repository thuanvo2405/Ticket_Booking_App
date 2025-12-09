"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Progress } from "@/components/ui/progress";
import { RadiantChart } from "@/components/RadiantChart";
import { EventLineChart } from "@/components/EventLineChart";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function EventStatisticsPage() {
  const [session, setSession] = useState("session1");
  const [range, setRange] = useState<"24h" | "30d">("30d");

  const data30d = Array.from({ length: 30 }).map((_, i) => ({
    date: `${i + 1}/12`,
    tickets: Math.floor(Math.random() * 5),
    revenue: Math.floor(Math.random() * 1000000),
  }));

  const data24h = Array.from({ length: 24 }).map((_, i) => ({
    date: `${i}h`,
    tickets: Math.floor(Math.random() * 3),
    revenue: Math.floor(Math.random() * 300000),
  }));

  const sessionDataMap = {
    session1: data30d,
    session2: data30d.map((d) => ({ ...d, tickets: d.tickets + 2 })),
    session3: data30d.map((d) => ({ ...d, tickets: d.tickets + 5 })),
  };

  const currentChartData = range === "30d" ? sessionDataMap[session] : data24h;

  const ticketData = [
    { type: "vip", price: 100000, sold: 0, total: 10, locked: 0 },
    { type: "standard", price: 50000, sold: 5, total: 20, locked: 1 },
  ];

  const columns: ColumnDef<(typeof ticketData)[0]>[] = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Loại vé",
        cell: ({ row }) => (
          <div className="capitalize font-medium">{row.getValue("type")}</div>
        ),
      },
      {
        accessorKey: "price",
        header: "Giá bán",
        cell: ({ row }) => (
          <div>
            {(row.getValue("price") as number).toLocaleString("vi-VN")}đ
          </div>
        ),
      },
      {
        accessorKey: "sold",
        header: "Đã bán",
        cell: ({ row }) => {
          const sold = row.getValue("sold") as number;
          const total = row.original.total;
          return (
            <div className="font-semibold">
              {sold} / {total}
            </div>
          );
        },
      },
      {
        accessorKey: "locked",
        header: "Bị khoá",
        cell: ({ row }) => <div>{row.getValue("locked")}</div>,
      },
      {
        id: "percent",
        header: () => <div className="text-right">Tỉ lệ bán</div>,
        cell: ({ row }) => {
          const { sold, total } = row.original;
          const percent = total > 0 ? (sold / total) * 100 : 0;

          return (
            <div className="flex items-center justify-end gap-3">
              <div className="w-40">
                <Progress value={percent} className="h-3 bg-gray-200" />
              </div>
              <span className="text-sm font-semibold">
                {percent.toFixed(0)}%
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Thống kê sự kiện</h1>

        <Select onValueChange={setSession} defaultValue={session}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn suất diễn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="session1">Suất 1 (10:00)</SelectItem>
            <SelectItem value="session2">Suất 2 (14:00)</SelectItem>
            <SelectItem value="session3">Suất 3 (20:00)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <RadiantChart
          text="Doanh thu"
          unit="đ"
          value={10000000}
          totalValue={10000000}
        />
        <RadiantChart text="Vé" unit="vé" value={500} totalValue={1000} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setRange("24h")}
          className={`px-4 py-2 rounded-lg border ${
            range === "24h" ? "bg-white text-black" : ""
          }`}
        >
          24 giờ
        </button>

        <button
          onClick={() => setRange("30d")}
          className={`px-4 py-2 rounded-lg border ${
            range === "30d" ? "bg-white text-black" : ""
          }`}
        >
          30 ngày
        </button>
      </div>

      <EventLineChart data={currentChartData} />

      <div>
        <h2 className="text-xl font-bold mb-2">Vé đã bán</h2>
        <DataTable columns={columns} data={ticketData} />
      </div>
    </div>
  );
}
