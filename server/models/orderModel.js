import pool from "../config/db.js";

export const createOrderService = async (manguoidung, items) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Tạo đơn hàng tạm
    const orderRes = await client.query(
      `
      INSERT INTO don_hang (manguoidung, trangthai, tongtien, thoihanthanhtoan)
      VALUES ($1, 'CHO_THANH_TOAN', 0, NOW() + INTERVAL '15 minutes')
      RETURNING madonhang, thoihanthanhtoan
      `,
      [manguoidung]
    );

    const madonhang = orderRes.rows[0].madonhang;
    let total = 0;

    // 2. Xử lý từng loại vé
    for (const item of items) {
      const { maloaive, soluong } = item;

      // 2.1: Lấy loại vé + khóa dòng trong transaction
      const ticketRes = await client.query(
        `
        SELECT giatien, soluongphathanh, soluongdaban, soluongkhoa
        FROM loai_ve
        WHERE maloaive = $1
        FOR UPDATE
        `,
        [maloaive]
      );

      if (ticketRes.rows.length === 0) {
        throw new Error(`Loại vé không tồn tại`);
      }

      const { giatien, soluongphathanh, soluongdaban, soluongkhoa } =
        ticketRes.rows[0];

      const soLuongConLai = soluongphathanh - soluongdaban - soluongkhoa;

      if (soLuongConLai < soluong) {
        throw new Error(
          `Loại vé ${maloaive} không đủ số lượng. Chỉ còn ${soLuongConLai} vé`
        );
      }

      // 2.2 Tính thành tiền (giá tuyệt đối từ BE)
      const thanhtien = giatien * soluong;
      total += thanhtien;

      // 2.3 Tăng số lượng khóa (giữ chỗ 15 phút)
      await client.query(
        `
        UPDATE loai_ve
        SET soluongkhoa = soluongkhoa + $1
        WHERE maloaive = $2
        `,
        [soluong, maloaive]
      );

      // 2.4 Tạo chi tiết đơn hàng
      await client.query(
        `
        INSERT INTO chi_tiet_don_hang (madonhang, maloaive, soluong, dongia, thanhtien)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [madonhang, maloaive, soluong, giatien, thanhtien]
      );
    }

    // 3. Update tổng tiền cho đơn
    await client.query(
      `UPDATE don_hang SET tongtien = $1 WHERE madonhang = $2`,
      [total, madonhang]
    );

    await client.query("COMMIT");

    return {
      madonhang,
      tongtien: total,
      thoihanthanhtoan: orderRes.rows[0].thoihanthanhtoan,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getOrderDetailService = async (madonhang) => {
  // 1. Lấy thông tin đơn hàng
  const orderRes = await pool.query(
    `
    SELECT madonhang, manguoidung, trangthai, tongtien, thoihanthanhtoan
    FROM don_hang
    WHERE madonhang = $1
    `,
    [madonhang]
  );

  if (orderRes.rows.length === 0) {
    throw new Error("Đơn hàng không tồn tại");
  }

  // 2. Lấy chi tiết đơn hàng + thông tin loại vé
  const detailRes = await pool.query(
    `
    SELECT 
      ctdh.maloaive,
      lv.tenloaive,
      lv.giatien,
      ctdh.soluong,
      ctdh.dongia,
      ctdh.thanhtien
    FROM chi_tiet_don_hang ctdh
    JOIN loai_ve lv ON ctdh.maloaive = lv.maloaive
    WHERE ctdh.madonhang = $1
    `,
    [madonhang]
  );

  return {
    order: orderRes.rows[0],
    items: detailRes.rows,
  };
};
