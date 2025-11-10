import { Card } from "@/components/ui/card";
import type { ReactElement } from "react";

export interface DashBoardCardProps {
  title: string;
  value: number;
  icon: ReactElement;
}

export default function DashBoardCard({
  title,
  value,
  icon,
}: DashBoardCardProps) {
  return (
    <Card className="flex flex-col items-center">
      <div className="bg-foreground/5 rounded-full p-3">{icon}</div>
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-3xl">{value}</h2>
        <p>{title}</p>
      </div>
    </Card>
  );
}
