import express from "express";
const router = express.Router();
import { protect} from "../../middleware/auth.middleware.js";
import { addToCart ,getCart , updateCart ,removeCartItem ,clearCart } from "./cart.controller.js";
import { addToCartValidation ,updateCartValidation ,removeCartItemValidation} from "./cart.validation.js";


router.post(
  "/",
  protect,
  addToCartValidation,
  addToCart
);

router.get(
    "/", protect, getCart
);

router.patch(
  "/:productId",
  protect,
  updateCartValidation,
  updateCart
);

router.delete(
  "/:productId",
  protect,
  removeCartItemValidation,
  removeCartItem
);

router.delete(
  "/",
  protect,
  clearCart
);


export default router;