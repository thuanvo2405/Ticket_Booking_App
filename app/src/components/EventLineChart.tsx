"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
}

export function EventLineChart({ data }: Props) {
  return (
    <div className="w-full h-72 bg-card rounded-xl p-4 border">
      <h2 className="font-bold text-lg mb-4">Thống kê theo thời gian</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
          <YAxis yAxisId="left" tick={{ fill: "#ccc" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#ccc" }} />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="tickets"
            stroke="#22c55e"
            strokeWidth={2}
            name="Số vé"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#a855f7"
            strokeWidth={2}
            name="Doanh thu"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
