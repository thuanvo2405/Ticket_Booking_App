import jwt from "jsonwebtoken";

function jwtTokens(user) {
  const payload = {
    user: { id: user.manguoidung, role: user.vaitro },
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "14d",
  });

  return { accessToken };
}

export { jwtTokens };
