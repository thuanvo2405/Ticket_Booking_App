import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "null token" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(401).json({ error: error.message });
    req.user = user;
    next();
  });
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
