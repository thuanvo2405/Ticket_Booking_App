import pool from "../config/db.js";

export const createOrderService = async (manguoidung, items) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

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

      if (soLuongConLai === 0) {
        throw new Error(`Loại vé này đã hết hàng`);
      }

      if (soLuongConLai < soluong) {
        throw new Error(
          `Loại vé không đủ số lượng. Chỉ còn ${soLuongConLai} vé`
        );
      }

      const thanhtien = giatien * soluong;
      total += thanhtien;

      await client.query(
        `
        UPDATE loai_ve
        SET soluongkhoa = soluongkhoa + $1
        WHERE maloaive = $2
        `,
        [soluong, maloaive]
      );

      await client.query(
        `
        INSERT INTO chi_tiet_don_hang (madonhang, maloaive, soluong, dongia, thanhtien)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [madonhang, maloaive, soluong, giatien, thanhtien]
      );
    }

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

export const getOrderDetailByIdService = async (madonhang) => {
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

export const getOrdersByUserIdService = async (manguoidung) => {
  const result = await pool.query(
    `
    SELECT *
    FROM don_hang
    WHERE manguoidung = $1
    `,
    [manguoidung]
  );

  return result.rows;
};

export const getOrderDetailService = async (madonhang) => {
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

  const detailTicket = await pool.query(
    `
    SELECT 
      v.mave,
      v.madonhang,
      v.maloaive,
      lv.tenloaive
    FROM ve v
    JOIN loai_ve lv ON v.maloaive = lv.maloaive
    WHERE v.madonhang = $1
  `,
    [madonhang]
  );

  return {
    order: orderRes.rows[0],
    items: detailRes.rows,
    tickets: detailTicket.rows,
  };
};

export const getTicketByOrderIDService = async (madonhang) => {
  const result = await pool.query(
    `
  SELECT 
    ve.*, 
    loai_ve.tenloaive, 
    sk.tensukien,
    sk.diachi,
    sk.quan,
    sk.phuong,
    sk.thanhpho,
    sd.thoigianbatdau
  FROM ve
  JOIN loai_ve ON loai_ve.maloaive = ve.maloaive
  JOIN suat_dien AS sd ON sd.masuatdien = loai_ve.masuatdien
  JOIN su_kien AS sk ON sd.masukien = sk.masukien
  WHERE ve.madonhang = $1;
    `,
    [madonhang]
  );

  return result.rows;
};
