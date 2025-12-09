import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "null token" });

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const result = await pool.query(
      "SELECT is_active,isverified FROM nguoi_dung WHERE manguoidung = $1",
      [user.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    if (!result.rows[0].isverified) {
      throw new Error("Tài khoản của bạn chưa được xác thực");
    }

    if (!result.rows[0].is_active) {
      throw new Error("Tài khoản của bạn đã bị khóa");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const parseTokenIfExists = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    req.user = undefined;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      req.user = undefined;
    } else {
      req.user = user;
    }
    next();
  });
};

export { authenticateToken, parseTokenIfExists };
