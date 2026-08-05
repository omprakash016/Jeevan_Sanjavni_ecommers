import express from "express";
import { createProduct } from "./product.controller.js";
import { createProductValidation } from "./product.validation.js";
import upload from "../../middleware/upload.middleware.js";
import { protect, isAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 6),
  createProductValidation,
  createProduct
);

export default router;