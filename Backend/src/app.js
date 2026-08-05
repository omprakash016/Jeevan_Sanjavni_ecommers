import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;