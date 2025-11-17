import { z } from "zod";

export const EventSchema = z.object({
  tenSuKien: z
    .string()
    .min(1, "Tên sự kiện là bắt buộc")
    .max(255, "Tên sự kiện không được vượt quá 255 ký tự"),
  diaChi: z
    .string()
    .min(1, "Địa chỉ là bắt buộc")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  phuong: z.string().min(1, "Phường/Xã là bắt buộc"),
  quan: z.string().min(1, "Quận/Huyện là bắt buộc"),
  thanhPho: z.string().min(1, "Tỉnh/Thành là bắt buộc"),
  maLoaiSuKien: z.string().min(1, "Loại sự kiện là bắt buộc"),
  moTa: z.string().optional(),
});

export const TicketTypeSchema = z.object({
  tenLoaiVe: z
    .string()
    .min(1, "Tên loại vé là bắt buộc")
    .max(100, "Tên loại vé không được vượt quá 100 ký tự"),
  moTa: z.string().optional(),
  giaTien: z
    .number({ invalid_type_error: "Giá tiền phải là số" })
    .min(0, "Giá tiền phải >= 0"),
  soLuongPhatHanh: z
    .number({ invalid_type_error: "Số lượng phát hành phải là số" })
    .min(1, "Số lượng phát hành phải >= 1"),
  maSuatDien: z.string().uuid("Mã suất diễn không hợp lệ"),
});

export const PerformanceSchema = z
  .object({
    thoiGianBatDau: z
      .string()
      .min(1, "Thời gian bắt đầu là bắt buộc")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Thời gian bắt đầu không hợp lệ"
      )
      .refine(
        (val) => new Date(val) > new Date(),
        "Thời gian bắt đầu phải lớn hơn thời gian hiện tại"
      ),
    thoiGianKetThuc: z
      .string()
      .min(1, "Thời gian kết thúc là bắt buộc")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Thời gian kết thúc không hợp lệ"
      ),
    maSuKien: z.string().uuid("Mã sự kiện không hợp lệ"),
  })
  .refine(
    (data) => new Date(data.thoiGianKetThuc) > new Date(data.thoiGianBatDau),
    {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      path: ["thoiGianKetThuc"],
    }
  );

export const PromotionSchema = z
  .object({
    maGiamGia: z.string().min(1, "Mã giảm giá là bắt buộc"),
    giaTriGiam: z
      .number()
      .refine((val) => val > 0, "Giá trị giảm phải lớn hơn 0"),
    loaiGiam: z.enum(["PHAN_TRAM", "SO_TIEN"], {
      required_error: "Loại giảm là bắt buộc",
    }),
    ngayBatDau: z
      .string()
      .min(1, "Ngày bắt đầu là bắt buộc")
      .refine((val) => !isNaN(Date.parse(val)), "Ngày bắt đầu không hợp lệ"),
    ngayKetThuc: z
      .string()
      .min(1, "Ngày kết thúc là bắt buộc")
      .refine((val) => !isNaN(Date.parse(val)), "Ngày kết thúc không hợp lệ"),
    soLuongPhatHanh: z
      .number()
      .int("Số lượng phải là số nguyên")
      .min(1, "Số lượng phải lớn hơn 0"),
    maSuKien: z.string().uuid("Mã sự kiện không hợp lệ"),
    giaTriToiThieu: z
      .number()
      .min(1, "Giá trị tối thiểu để áp dụng giảm giá phải lớn hơn 0"),
  })
  .refine((data) => new Date(data.ngayKetThuc) > new Date(data.ngayBatDau), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["ngayKetThuc"],
  })
  .refine(
    (data) => (data.loaiGiam === "PHAN_TRAM" ? data.giaTriGiam <= 100 : true),
    {
      message: "Giảm theo phần trăm phải ≤ 100%",
      path: ["giaTriGiam"],
    }
  )
  .refine(
    (data) =>
      data.loaiGiam === "SO_TIEN"
        ? data.giaTriGiam <= data.giaTriToiThieu
        : true,
    {
      message: "Giá trị giảm không thể lớn hơn giá trị tối thiểu áp dụng",
      path: ["giaTriGiam"],
    }
  );
