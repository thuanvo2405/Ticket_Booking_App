import { useState, useEffect } from "react";

interface CounterProps {
  endTime: string;
}

export default function Counter({ endTime }: CounterProps) {
  const getTimeLeft = () => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Hết hạn";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}p ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const isExpired = timeLeft === "Hết hạn";

  return (
    <span
      className={isExpired ? "text-red-600 font-semibold" : "text-gray-700"}
    >
      {timeLeft}
    </span>
  );
}
