import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import organizerRoutes from "./routes/organizerRoute.js";
import eventRoutes from "./routes/eventRoute.js";
import ticketRoute from "./routes/ticketRoute.js";
import promotionRoute from "./routes/promotionRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import orderRoute from "./routes/orderRoute.js";
import upload from "./utils/multer.js";
import errorHandling from "./middleware/errorHandler.js";
import nodeCron from "./utils/orderCleanup.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
const router = express.Router();
app.use("/uploads", express.static("uploads"));

app.use("/v1/api", userRoutes);
app.use("/v1/api", organizerRoutes);
app.use("/v1/api", eventRoutes);
app.use("/v1/api", ticketRoute);
app.use("/v1/api", promotionRoute);
app.use("/v1/api", paymentRoute);
app.use("/v1/api", orderRoute);

router.post("/uploads", upload.single("image"), (req, res) => {
  const imageUrl = req.file.path;
  return res.json({ imageUrl });
});

app.use(errorHandling);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
