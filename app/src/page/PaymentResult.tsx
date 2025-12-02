import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Home, Ticket, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { retryCheckoutAPI } from "@/services/orderService";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");
  const madonhang = searchParams.get("madonhang");

  const isSuccess = resultCode === "0";

  const retryPaymentMutation = useMutation({
    mutationFn: () => retryCheckoutAPI(madonhang!),
    onSuccess: (data) => {
      window.location.href = data.payUrl;
    },
    onError: (error) => {
      console.error("Checkout failed:", error);
    },
  });

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-4 shadow-lg">
        <CardHeader className="text-center">
          {isSuccess ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
          <CardTitle className="text-2xl font-bold mt-4">
            {isSuccess ? "Thanh toán thành công 🎉" : "Thanh toán thất bại ❌"}
          </CardTitle>
          <p className="text-gray-500 mt-2">Mã đơn hàng: {orderId}</p>
        </CardHeader>

        <CardContent className="text-center space-y-2">
          <p className="text-gray-700">{message}</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 mt-4">
          {isSuccess ? (
            <>
              <Button asChild className="w-full">
                <a href="/my-tickets" className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" /> Xem vé của tôi
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> Về trang chủ
                </a>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => retryPaymentMutation.mutate()}
              >
                <DollarSign className="w-4 h-4" /> Thanh toán lại
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> Về trang chủ
                </a>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
