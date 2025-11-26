import { Card } from "@/components/ui/card";
import type { ReactElement } from "react";

export interface DashBoardCardProps {
  title: string;
  value: number | string;
  icon: ReactElement;
}

export default function DashBoardCard({
  title,
  value,
  icon,
}: DashBoardCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gray-100 dark:bg-gray-800 text-blue-500 dark:text-blue-400 rounded-full p-4 mb-4 shadow-sm flex items-center justify-center text-2xl">
        {icon}
      </div>

      <div className="flex flex-col items-center">
        <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-100 mb-1">
          {value}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          {title}
        </p>
      </div>
    </Card>
  );
}
