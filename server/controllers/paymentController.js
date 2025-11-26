import handleResponse from "../utils/handleResponse.js";
import {
  createPaymentService,
  validateCouponService,
  validateOrderPaymentDeadline,
  applyCouponToOrder,
} from "../models/paymentModel.js";
import axios from "axios";
import crypto from "crypto";
import pool from "../config/db.js";
var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

export const createPayment = async (req, res, next) => {
  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  var ipnUrl = "https://d99dbe862732.ngrok-free.app/v1/api/callback-payment";
  var requestType = "payWithMethod";
  var amount = "50000";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios.request(options);
    handleResponse(res, 200, true, result.data, "Create payment success");
  } catch (error) {
    next(error);
  }
};

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
    // ====== 1. Verify signature ======
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

    // ====== 2. Parse extraData ======
    const extra = JSON.parse(extraData);
    const madonhang = extra.madonhang;

    if (!madonhang) {
      return res.status(400).json({ message: "Missing madonhang" });
    }

    // ====== 3. Prevent double processing ======
    const { rows: orderStatus } = await pool.query(
      `SELECT trangthai, makhuyenmai FROM don_hang WHERE madonhang = $1`,
      [madonhang]
    );
    if (!orderStatus.length) {
      return res.status(400).json({ message: "Order not found" });
    }

    const makhuyenmai = orderStatus[0].makhuyenmai;
    if (orderStatus[0].trangthai === "DA_THANH_TOAN") {
      return res.json({ message: "Order already processed" });
    }

    // ====== 4. IF PAYMENT FAILED ======
    if (resultCode !== 0) {
      console.log("❌ Payment failed:", message);

      if (makhuyenmai) {
        await pool.query(
          `UPDATE khuyen_mai
           SET soluongkhoa = GREATEST(soluongkhoa - 1, 0)
           WHERE makhuyenmai = $1`,
          [makhuyenmai]
        );
      }

      await pool.query(
        `UPDATE don_hang SET trangthai = 'THAT_BAI' WHERE madonhang = $1`,
        [madonhang]
      );

      return res.json({ message: "Payment failed, promo restored" });
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
          `INSERT INTO ve (trangthai, qrcode, phidichvu, sotienthucnhan, maloaive, madonhang)
           VALUES ('CHUA_SU_DUNG', gen_random_uuid()::text, 0, 0, $1, $2)`,
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
      `UPDATE don_hang SET trangthai = 'DA_THANH_TOAN' WHERE madonhang = $1`,
      [madonhang]
    );
    console.log("end");
    res.json({ message: "Payment success" });
  } catch (error) {
    next(error);
  }
};

export const checkTransactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: "MOMO",
      requestId: orderId,
      orderId,
      signature,
      lang: "vi",
    });

    const options = {
      method: "POST",
      url: "https://d99dbe862732.ngrok-free.app/v1/api/callback-payment",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    let result = await axios.request(options);
    handleResponse(res, 200, "Check transaction status success", result.data);
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
  console.log(order);

  const amount = Math.round(order.tongtien);

  const partnerCode = "MOMO";
  const orderId = order.madonhang + new Date().getTime();
  const requestId = orderId;
  const orderInfo = `Thanh toán đơn hàng ${madonhang}`;
  const redirectUrl = `http://localhost:5173/payment-result`;
  const ipnUrl = "https://a56dc2e02975.ngrok-free.app/v1/api/callback-payment";
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
    console.log(momoResult);

    handleResponse(res, 200, "Tạo link thanh toán thành công", momoResult);
  } catch (error) {
    next(error);
  }
};
