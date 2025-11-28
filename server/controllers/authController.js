import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "../config/db.js";
import {
  logInService,
  signUpService,
  logInServiceForAdmin,
  signUpForAdminService,
} from "../models/userModel.js";
import { jwtTokens } from "../utils/jwtHelper.js";
import handleResponse from "../utils/handleResponse.js";
import {
  sendVerificationEmail,
  sendResetPasswordMail,
} from "../utils/sendEmail.js";
import {
  signUpSchema,
  loginSchema,
  changePasswordSchema,
} from "../utils/validate.js";
import z from "zod";

const saltRound = 10;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

dotenv.config();

export const signup = async (req, res, next) => {
  const { tennguoidung, email, matkhau } = signUpSchema.parse(req.body);

  const emailNormalized = email.trim().toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    const user = await signUpService(
      tennguoidung,
      emailNormalized,
      hashedPassword
    );

    const verifyToken = jwt.sign(
      { userId: user.manguoidung },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(emailNormalized, verifyToken);

    res.status(200).json({
      message:
        "Tài khoản tạo thành công.Vui lòng vào mail để xác thực tài khoản",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, matKhau } = loginSchema.parse(req.body);
    const user = await logInService(email);
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Người dùng không tồn tại" });
    }

    if (!user.is_active) {
      return handleResponse(res, 403, "Tài khoản đã bị khóa bởi quản trị viên");
    }

    if (!user.isverified) {
      return res.status(403).json({
        error: "Email chưa xác thực. Vui lòng vào email để kiểm tra.",
      });
    }
    const validPassword = await bcrypt.compare(matKhau, user.matkhau);
    if (!validPassword) {
      return res.status(401).json({ error: "Mật khẩu không chính xác!" });
    }

    const tokens = jwtTokens(user);

    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    const { manguoidung, vaitro } = user;

    handleResponse(res, 200, "Login successful", {
      user: { manguoidung, vaitro },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const loginForAdmin = async (req, res, next) => {
  try {
    const { email, matKhau } = loginSchema.parse(req.body);

    const user = await logInServiceForAdmin(email);

    if (!user) {
      return res.status(401).json({ error: "Người dùng không tồn tại" });
    }
    if (!user.is_active) {
      return handleResponse(res, 403, "Tài khoản đã bị khóa bởi quản trị viên");
    }

    const validPassword = await bcrypt.compare(matKhau, user.matkhau);
    if (!validPassword) {
      return res.status(401).json({ error: "Mật khẩu không chính xác!" });
    }

    const tokens = jwtTokens(user);

    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    const { manguoidung, vaitro } = user;

    handleResponse(res, 200, "Login successful", {
      user: { manguoidung, vaitro },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const signupForAdmin = async (req, res, next) => {
  const { tennguoidung, email, matkhau } = req.body;
  console.log(req.body);
  const emailVerified = email.trim().toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(matkhau, 10);

    const user = await signUpForAdminService(
      tennguoidung,
      emailVerified,
      hashedPassword
    );

    handleResponse(res, 200, "Tạo người dùng mới thành công", user);
  } catch (error) {
    next(error);
  }
};

export const getRefreshToken = async (req, res, next) => {
  try {
    console.log("req.cookies:", req.cookies);
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: "null refresh token" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) {
          return res.status(401).json({ error: error.message });
        }
        let tokens = jwtTokens(user);
        res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
      }
    );
  } catch (error) {
    next(error);
  }
};

export const deleteRefreshToken = async (req, res, next) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  try {
    const payload = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    await pool.query(
      "UPDATE nguoi_dung SET isverified = true WHERE manguoidung = $1",
      [payload.userId]
    );

    handleResponse(res, 200, "Email verified successfully. You can now login!");
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await logInService(email);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isverified)
      return res.status(400).json({ error: "Email already verified" });

    const verifyToken = jwt.sign(
      { userId: user.manguoidung },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(email, verifyToken);

    res
      .status(200)
      .json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await pool.query("Select * from nguoi_dung where email=$1", [
      email,
    ]);
    const user = result.rows[0];
    console.log(user);
    if (!user) {
      throw new Error("Rất tiếc tài khoản không tồn tại");
    }
    const token = jwt.sign(
      { manguoidung: user.manguoidung },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    await sendResetPasswordMail(email, token);

    handleResponse(res, 200, "Nếu email tồn tại, bạn sẽ nhận được link");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;

    const password = z
      .string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .max(15, "Mật khẩu không dài quá 15 ký tự")
      .regex(passwordRegex, {
        message:
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.",
      })
      .parse(req.body.password);

    const payload = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const manguoidung = payload.manguoidung;

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const result = await pool.query(
      "UPDATE nguoi_dung SET matkhau = $1 WHERE manguoidung = $2",
      [hashedPassword, manguoidung]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    handleResponse(res, 200, "Mật khẩu đã thay đổi thành công!");
  } catch (error) {
    next(error);
  }
};

export const resetPasswordByUserId = async (req, res, next) => {
  try {
    const userId = req.user.user.id;

    const { matkhauhientai, matkhaumoi } = changePasswordSchema.parse(req.body);

    const result = await pool.query(
      "SELECT matkhau FROM nguoi_dung WHERE manguoidung = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    const currentHashed = result.rows[0].matkhau;

    const isMatch = await bcrypt.compare(matkhauhientai, currentHashed);
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu hiện tại không đúng" });
    }

    const hashedPassword = await bcrypt.hash(matkhaumoi, 10);

    await pool.query(
      "UPDATE nguoi_dung SET matkhau = $1 WHERE manguoidung = $2",
      [hashedPassword, userId]
    );

    handleResponse(res, 200, "Cập nhật mật khẩu thành công");
  } catch (err) {
    next(err);
  }
};
