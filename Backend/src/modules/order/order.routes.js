import express from "express";
import { protect} from "../../middleware/auth.middleware.js";
import { placeOrderValidation ,getOrderDetailsValidation ,cancelOrderValidation} from "./order.validation.js";
import { placeOrder ,getMyOrders ,getOrderDetails,cancelOrder } from "./order.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  placeOrderValidation,
  placeOrder
);

router.get(
  "/",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getOrderDetailsValidation,
  getOrderDetails
);

router.patch(
  "/:id/cancel",
  protect,
  cancelOrderValidation,
  cancelOrder,
);
export default router;