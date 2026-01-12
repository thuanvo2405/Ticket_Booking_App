import { z } from "zod";

export const EventSchema = z.object({
  tenSuKien: z
    .string()
    .trim()
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
  moTa: z.string().refine(
    (val) => {
      const plainText = val
        .replace(/<(.|\n)*?>/g, "")
        .replace(/&nbsp;/g, "")
        .trim();

      return plainText.length > 0;
    },
    {
      message: "Mô tả là bắt buộc",
    }
  ),
});

export const TicketTypeSchema = z.object({
  tenLoaiVe: z
    .string()
    .trim()
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
    maGiamGia: z.string().min(1, "Mã giảm giá là bắt buộc").trim(),
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

export const UpdatePromotionSchema = z
  .object({
    maGiamGia: z.string().min(1, "Mã giảm giá là bắt buộc").trim(),
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

export const TicketSchema = z.object({
  maLoaiVe: z.string().min(1, "Mã loại vé không hợp lệ"),
  soLuong: z.number().int().positive("Số lượng phải > 0"),
});

export const CreateOrderSchema = z.object({
  maNguoiDung: z.number().positive("Mã người dùng không hợp lệ"),
  maSuatDien: z.string().min(1, "Mã suất diễn không hợp lệ"),
  tickets: z.array(TicketSchema).nonempty("Phải chọn ít nhất 1 vé"),
});

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

export const signUpSchema = z.object({
  tennguoidung: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên quá dài"),

  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),

  matkhau: z
    .string()
    .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" })
    .max(15, { message: "Mật khẩu không dài quá 15 ký tự" })
    .regex(passwordRegex, {
      message:
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.",
    }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  matKhau: z
    .string()
    .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" })
    .max(15, { message: "Mật khẩu không dài quá 15 ký tự" }),
});

export const updateProfileSchema = z.object({
  tennguoidung: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên quá dài")
    .optional(),
  sodienthoai: z
    .string()
    .regex(/^\+?\d{10,12}$/, "Số điện thoại không hợp lệ")
    .optional(),
});

export const changePasswordSchema = z.object({
  matkhauhientai: z.string().min(6, "Mật khẩu hiện tại tối thiểu 6 ký tự"),
  matkhaumoi: z
    .string()
    .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" })
    .max(15, { message: "Mật khẩu không dài quá 15 ký tự" })
    .regex(passwordRegex, {
      message:
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.",
    }),
});

export const UpdatePerformanceSchema = z
  .object({
    maSuatDien: z.string().uuid("Mã suất diễn không hợp lệ"),
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
  })
  .refine(
    (data) => new Date(data.thoiGianKetThuc) > new Date(data.thoiGianBatDau),
    {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      path: ["thoiGianKetThuc"],
    }
  );

export const UpdateTicketTypeSchema = z.object({
  tenLoaiVe: z
    .string()
    .trim()
    .min(1, "Tên loại vé là bắt buộc")
    .max(100, "Tên loại vé không được vượt quá 100 ký tự"),
  moTa: z.string().optional(),
  giaTien: z
    .number({ invalid_type_error: "Giá tiền phải là số" })
    .min(0, "Giá tiền phải >= 0"),
  soLuongPhatHanh: z
    .number({ invalid_type_error: "Số lượng phát hành phải là số" })
    .min(1, "Số lượng phát hành phải >= 1"),
  maLoaiVe: z.string().uuid("Mã loại vé không hợp lệ"),
});

export const CategorySchema = z.object({
  tenloaisukien: z
    .string()
    .trim()
    .min(2, "Tên loại sự kiện phải có ít nhất 2 ký tự")
    .max(100, "Tên loại sự kiện quá dài"),
});
