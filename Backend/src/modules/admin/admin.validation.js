import { body ,param } from "express-validator";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../constants/orderStatus.js";
export const getSingleOrderValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Order ID"),
];

export const updateOrderStatusValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid Order ID"),

    body("orderStatus")
        .notEmpty()
        .withMessage("Order status is required")

        .isIn(Object.values(ORDER_STATUS))
        .withMessage("Invalid order status"),
];