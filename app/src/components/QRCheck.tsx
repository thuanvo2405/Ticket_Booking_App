import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useMutation } from "@tanstack/react-query";
import { checkinAPI } from "@/services/checkinService";

interface QRCheckProps {
  maSuatDien: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const QRCheck: React.FC<QRCheckProps> = ({
  maSuatDien,
  onClose,
  onSuccess,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (qrCode: string) => checkinAPI(qrCode, maSuatDien),
    onSuccess: (data) => {
      setResultMessage(`Check-in thành công: ${data.message}`);
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      setResultMessage(
        `Check-in thất bại: ${err?.response?.data?.message || err.message}`
      );
    },
    onSettled: () => {},
  });

  const handleScan = (code: string) => {
    if (!code || isPaused) return;

    setIsPaused(true);
    mutation.mutate(code);
  };

  const handleContinue = () => {
    setIsPaused(false);
    setResultMessage(null);
  };

  return (
    <div className="flex flex-col items-center">
      {!isPaused && (
        <Scanner
          onScan={(result) => handleScan(result[0]?.rawValue || "")}
          onError={(error: any) => console.log(error?.message)}
          paused={isPaused}
          constraints={{ facingMode: "environment" }}
        />
      )}

      {mutation.isPending && <p>Đang check-in...</p>}

      {resultMessage && (
        <div className="mt-4 text-center">
          <p>{resultMessage}</p>
          <div className="flex gap-2 justify-center mt-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleContinue}
            >
              Tiếp tục quét
            </button>
            {onClose && (
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCheck;
