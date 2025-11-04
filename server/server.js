import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import organizerRoutes from "./routes/organizerRoute.js";
import errorHandling from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/v1/api", userRoutes);
app.use("/v1/api", organizerRoutes);

app.use(errorHandling);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
