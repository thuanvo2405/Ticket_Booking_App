import { ZodError } from "zod";

export default (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ZodError || err.name === "ZodError") {
    return res.status(400).json({
      status: 400,
      message: (err.issues || []).map((e) => e.message).join(", "),
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Something went wrong",
  });
};
