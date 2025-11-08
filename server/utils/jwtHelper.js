import jwt from "jsonwebtoken";

function jwtTokens(user) {
  const payload = {
    user: { id: user.manguoidung, role: user.vaitro },
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10d",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20d",
  });

  return { accessToken, refreshToken };
}

export { jwtTokens };
