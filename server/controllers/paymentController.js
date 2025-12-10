import handleResponse from "../utils/handleResponse.js";
import {
  validateCouponService,
  validateOrderPaymentDeadline,
  applyCouponToOrder,
} from "../models/paymentModel.js";
import axios from "axios";
import crypto from "crypto";
import pool from "../config/db.js";
var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

export const updatePayment = async (req, res, next) => {
  try {
    const {
      orderId,
      amount,
      resultCode,
      message,
      signature,
      extraData,
      partnerCode,
    } = req.body;
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${req.body.orderInfo || ""}` +
      `&orderType=${req.body.orderType || ""}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${req.body.payType}` +
      `&requestId=${req.body.requestId}` +
      `&responseTime=${req.body.responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${req.body.transId}`;

    const checkSig = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (checkSig !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const extra = JSON.parse(extraData);
    const madonhang = extra.madonhang;

    if (!madonhang) {
      return res.status(400).json({ message: "Missing madonhang" });
    }

    const { rows: orderStatus } = await pool.query(
      `SELECT trangthai, makhuyenmai FROM don_hang WHERE madonhang = $1`,
      [madonhang]
    );
    if (!orderStatus.length) {
      return res.status(400).json({ message: "Order not found" });
    }

    // ====== 4. IF PAYMENT FAILED ======
    if (resultCode !== 0) {
      return res.status(200).json({
        message: "Payment failed",
        madonhang,
        errorDetail: message,
      });
    }

    // ====== 5. SUCCESS: CREATE TICKET ======
    const { rows: items } = await pool.query(
      `SELECT * FROM chi_tiet_don_hang WHERE madonhang = $1`,
      [madonhang]
    );

    for (const item of items) {
      const { maloaive, soluong } = item;

      for (let i = 0; i < soluong; i++) {
        await pool.query(
          `INSERT INTO ve (trangthai, qrcode, maloaive, madonhang)
           VALUES ('CHUA_SU_DUNG', gen_random_uuid()::text, $1, $2)`,
          [maloaive, madonhang]
        );
      }

      await pool.query(
        `UPDATE loai_ve
         SET soluongdaban = soluongdaban + $1,
             soluongkhoa = GREATEST(soluongkhoa - $1, 0)
         WHERE maloaive = $2`,
        [soluong, maloaive]
      );
    }

    // ====== 6. Update order status ======
    await pool.query(
      `UPDATE don_hang SET trangthai = 'DA_THANH_TOAN', thoigianthanhtoan = NOW() WHERE madonhang = $1`,
      [madonhang]
    );
    res.json({ message: "Payment success" });
  } catch (error) {
    next(error);
  }
};

export const prepareMomoPayment = async (madonhang) => {
  const { rows: orders } = await pool.query(
    `SELECT * FROM don_hang WHERE madonhang = $1`,
    [madonhang]
  );
  const order = orders[0];
  if (!order) throw new Error("Đơn hàng không tồn tại");

  const amount = Math.round(order.tongtien);

  const partnerCode = "MOMO";

  const orderId = order.madonhang + new Date().getTime();
  const requestId = orderId;
  const orderInfo = `Thanh toán đơn hàng ${madonhang}`;
  const redirectUrl = `http://localhost:5173/payment-result?madonhang=${madonhang}`;
  const ipnUrl = "https://da37134eda87.ngrok-free.app/v1/api/callback-payment";
  const requestType = "payWithMethod";
  const expiry = order.thoi_han_thanh_toan?.getTime() || null;
  const extraData = JSON.stringify({ expiry, madonhang });

  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount: amount.toString(),
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    requestType,
    autoCapture: true,
    extraData,
    orderGroupId: "",
    signature,
  };

  const result = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody,
    { headers: { "Content-Type": "application/json" } }
  );

  return result.data;
};

export const handlePaymentRequest = async (req, res, next) => {
  try {
    const { madonhang } = req.query;
    const { makhuyenmai } = req.body;

    let order = await validateOrderPaymentDeadline(madonhang);
    let coupon;
    if (makhuyenmai) {
      coupon = await validateCouponService(makhuyenmai);
      await applyCouponToOrder(order, coupon);
    }

    const momoResult = await prepareMomoPayment(madonhang);

    handleResponse(res, 200, "Tạo link thanh toán thành công", momoResult);
  } catch (error) {
    next(error);
  }
};

export const retryPayment = async (req, res, next) => {
  try {
    const { madonhang } = req.query;

    const order = await validateOrderPaymentDeadline(madonhang);

    if (order.trangthai === "HET_HAN") {
      return res
        .status(400)
        .json({ message: "Đơn hàng không thể thanh toán vì đã hết hạn" });
    }

    if (order.trangthai === "DA_THANH_TOAN") {
      return res.status(400).json({
        message: "Đơn hàng không thể thanh toán vì bạn đã thanh toán rồi",
      });
    }
    const coupon = order.makhuyenmai
      ? await validateCouponService(order.makhuyenmai)
      : null;

    const momoResult = await prepareMomoPayment(madonhang);

    handleResponse(res, 200, "Tạo link thanh toán lại thành công", momoResult);
  } catch (error) {
    next(error);
  }
};
