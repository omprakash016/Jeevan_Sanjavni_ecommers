import express from "express";
import { createProduct ,getAllProducts ,getProductBySlug, updateProduct ,deleteProduct ,restoreProduct} from "./product.controller.js";
import { createProductValidation ,updateProductValidation } from "./product.validation.js";
import upload from "../../middleware/upload.middleware.js";
import { protect, isAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
   isAdmin,
  upload.array("images", 6),
  createProductValidation,
  createProduct
);

router.get("/", getAllProducts);

router.get("/:slug", getProductBySlug);

router.put("/:id", protect, isAdmin, upload.array("images", 6), updateProductValidation, updateProduct);

router.delete("/:id", protect, isAdmin, deleteProduct);
router.patch("/:id/restore", protect, isAdmin, restoreProduct);

export default router;