// PaymentInfoPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/convert";
import { Ticket, Tag, DollarSign, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkOutAPI, getOrderByIDAPI } from "@/services/orderService";
import { getPromotionAPI } from "@/services/promotionService";
import { useParams } from "react-router-dom";
import Counter from "@/components/counter";
import { type Item, type Order, type Promotion } from "@/constant/types";
import toast from "react-hot-toast";

export default function PaymentInfoPage() {
  const { madonhang, maSuKien } = useParams();

  const { data: orderData, isFetching: orderLoading } = useQuery<{
    order: Order;
    items: Item[];
  }>({
    queryKey: ["orderDetail", madonhang],
    queryFn: () => getOrderByIDAPI(madonhang!),
    enabled: !!madonhang,
  });

  const order = orderData?.order;
  const items: Item[] = orderData?.items || [];

  const { data: promotion, isFetching: promoLoading } = useQuery<Promotion[]>({
    queryKey: ["promotions", maSuKien],
    queryFn: () => getPromotionAPI(maSuKien!),
    enabled: !!maSuKien,
  });

  const [total, setTotal] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    if (!order || items.length === 0) return;

    let newTotal = items.reduce((sum, i) => sum + i.dongia * i.soluong, 0);

    if (appliedPromo) {
      if (appliedPromo.loaigiam === "PHAN_TRAM") {
        newTotal *= 1 - appliedPromo.giatrigiam / 100;
      } else {
        newTotal -= appliedPromo.giatrigiam;
      }
    }

    if (newTotal < 0) newTotal = 0;

    setTotal(newTotal);
  }, [order, items, appliedPromo]);

  const applyPromotion = (promo: Promotion) => {
    const orderTotal = items.reduce((sum, i) => sum + i.dongia * i.soluong, 0);
    if (orderTotal < promo.giatritoithieu) {
      alert(`Đơn hàng phải >= ${formatPrice(promo.giatritoithieu)} để áp dụng`);
      return;
    }
    setAppliedPromo(promo);
  };

  const removePromotion = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handleCheckOut = useMutation({
    mutationFn: () => checkOutAPI(madonhang!, appliedPromo?.makhuyenmai || ""),
    onSuccess: (data) => {
      window.location.href = data.payUrl;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
      console.error("Checkout failed:", error);
    },
  });

  if (orderLoading || promoLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full grid grid-cols-[2fr_1fr] gap-8 p-6">
      {/* LEFT SIDE */}
      <Card className="sticky top-6 shadow-md rounded-2xl border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-gray-600" /> Thông tin đơn hàng
          </CardTitle>
          <p className="text-sm font-medium mt-1">
            Hạn thanh toán: <Counter endTime={order!.thoihanthanhtoan} />
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-50 px-5 py-4 rounded-xl shadow-sm text-lg"
            >
              <span className="font-medium flex items-center gap-2">
                <Ticket className="w-5 h-5 text-gray-500" /> {item.tenloaive} ×{" "}
                {item.soluong}
              </span>
              <span className="font-semibold flex items-center gap-1">
                {formatPrice(item.dongia * item.soluong)}
              </span>
            </div>
          ))}

          <div>
            <div className="pt-4 border-t flex justify-between text-md font-semibold">
              <span>Tổng giá vé</span>
              <span>
                {formatPrice(
                  items.reduce((sum, i) => sum + i.dongia * i.soluong, 0)
                )}
              </span>
            </div>
            <div className="pt-4 flex justify-between text-sm font-semibold">
              <span>Khuyến mãi</span>
              <span className="text-green-600">
                {appliedPromo
                  ? `- ${formatPrice(
                      appliedPromo.loaigiam === "PHAN_TRAM"
                        ? (items.reduce(
                            (sum, i) => sum + i.dongia * i.soluong,
                            0
                          ) *
                            appliedPromo.giatrigiam) /
                            100
                        : appliedPromo.giatrigiam
                    )}`
                  : "- 0"}
              </span>
            </div>
            <div className="pt-4 mt-4 border-t flex justify-between text-xl font-bold">
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            onClick={() => handleCheckOut.mutate()}
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" /> Thanh toán
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT SIDE */}
      <Card className="sticky top-6 shadow-md rounded-2xl border border-gray-200">
        <CardHeader className="pb-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-gray-600" /> Khuyến mãi
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã khuyến mãi..."
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-14 text-lg rounded-xl px-5 flex-1"
            />
            <Button
              onClick={() => {
                const promo = promotion?.find(
                  (p) =>
                    p.makhuyenmai.toLowerCase() ===
                      promoCode.trim().toLowerCase() ||
                    p.magiamgia?.toLowerCase() ===
                      promoCode.trim().toLowerCase()
                );
                if (promo) applyPromotion(promo);
                else alert("Mã khuyến mãi không hợp lệ");
              }}
              className="h-14"
            >
              Áp dụng
            </Button>
          </div>

          {appliedPromo && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-xl text-green-700 font-semibold text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Đang áp dụng: {appliedPromo.magiamgia || appliedPromo.makhuyenmai}
              <Button
                onClick={removePromotion}
                variant="ghost"
                className="p-0 ml-auto text-green-700 hover:bg-green-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="space-y-4 mt-2">
            {promotion?.map((promo) => {
              const orderTotal = items.reduce(
                (sum, i) => sum + i.dongia * i.soluong,
                0
              );
              const disabled = orderTotal < promo.giatritoithieu;
              const selected = appliedPromo?.makhuyenmai === promo.makhuyenmai;

              return (
                <div
                  key={promo.makhuyenmai}
                  onClick={() => !disabled && applyPromotion(promo)}
                  className={`
                    p-5 rounded-xl border transition-all cursor-pointer
                    shadow-sm bg-white
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md hover:bg-gray-50"
                    }
                    ${
                      selected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300"
                    }
                  `}
                >
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />{" "}
                      {promo.magiamgia || promo.makhuyenmai}
                    </span>
                    <span>
                      {promo.loaigiam === "PHAN_TRAM"
                        ? `${promo.giatrigiam}%`
                        : formatPrice(promo.giatrigiam)}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-500">
                    Áp dụng cho đơn từ {formatPrice(promo.giatritoithieu)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
