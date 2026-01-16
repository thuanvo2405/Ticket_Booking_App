import { Card, CardContent } from "@/components/ui/card";

type Props = {
  tongVe: number;
  daCheckin: number;
  tiLeCheckin: number;
};

const CheckinOverviewCard = ({ tongVe, daCheckin, tiLeCheckin }: Props) => {
  return (
    <Card className="bg-neutral-900 text-white rounded-xl">
      <CardContent className="flex items-center justify-between p-6">
        {/* LEFT */}
        <div className="space-y-3">
          <p className="text-lg font-medium text-neutral-300">Đã check-in</p>

          <p className="text-4xl font-bold">{daCheckin} vé</p>

          <p className="text-sm text-neutral-400">Đã bán {tongVe} vé</p>
        </div>

        {/* RIGHT - CIRCLE */}
        <div className="relative w-28 h-28">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#262626"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#facc15"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - tiLeCheckin / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-400">
              {tiLeCheckin}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckinOverviewCard;
