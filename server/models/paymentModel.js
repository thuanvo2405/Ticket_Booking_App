import pool from "../config/db.js";

export const createPaymentService = async () => {};

export async function validateOrderPaymentDeadline(madonhang) {
  const result = await pool.query(
    `SELECT *
    FROM don_hang
    WHERE madonhang = $1`,
    [madonhang]
  );
  const order = result.rows[0];

  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }

  const now = new Date();
  if (now > order.thoihanthanhtoan) {
    throw new Error("Đơn hàng đã quá hạn thanh toán");
  }

  return order;
}

export async function validateCouponService(makhuyenmai) {
  const result = await pool.query(
    `
    SELECT *
    FROM khuyen_mai
    WHERE makhuyenmai = $1
  `,
    [makhuyenmai]
  );
  const coupon = result.rows[0];

  if (!coupon) {
    throw new Error("Mã khuyến mãi không tồn tại");
  }

  const now = new Date();

  if (now < coupon.ngaybatdau || now > coupon.ngayketthuc) {
    console.log(coupon.ngayketthuc);
    throw new Error("Mã khuyến mãi không còn hiệu lực");
  }

  if (coupon.soluongphathanh - coupon.soluongdasudung <= 0) {
    throw new Error("Mã khuyến mãi đã hết lượt sử dụng");
  }

  return coupon;
}

export async function applyCouponToOrder(order, coupon) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let discountedTotal = order.tongtien;
    if (coupon.loaigiam === "PHAN_TRAM") {
      discountedTotal = order.tongtien * (1 - coupon.giatrigiam / 100);
    } else if (coupon.loaigiam === "SO_TIEN") {
      discountedTotal = order.tongtien - coupon.giatrigiam;
    }

    await client.query(
      `UPDATE don_hang
       SET makhuyenmai = $1,
           tongtien = $2
       WHERE madonhang = $3`,
      [coupon.makhuyenmai, discountedTotal, order.madonhang]
    );

    await client.query(
      `UPDATE khuyen_mai
       SET soluongdasudung = soluongdasudung + 1
       WHERE makhuyenmai = $1`,
      [coupon.makhuyenmai]
    );

    await client.query("COMMIT");
    return { success: true, discountedTotal };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
