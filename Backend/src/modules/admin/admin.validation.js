import { body, param } from "express-validator";

import {
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "../../constants/orderStatus.js";


// ========================================
// GET SINGLE ORDER
// ========================================

export const getSingleOrderValidation = [

  param("id")
    .isMongoId()
    .withMessage("Invalid Order ID"),

];


// ========================================
// UPDATE ORDER / PAYMENT STATUS
// ========================================

export const updateOrderStatusValidation = [

  param("id")
    .isMongoId()
    .withMessage("Invalid Order ID"),


  body("orderStatus")
    .optional()
    .isIn(Object.values(ORDER_STATUS))
    .withMessage("Invalid order status"),


  body("paymentStatus")
    .optional()
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage("Invalid payment status"),

];