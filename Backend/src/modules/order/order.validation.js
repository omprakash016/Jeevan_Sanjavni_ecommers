import { body ,param } from "express-validator";

export const placeOrderValidation = [
  body("addressId")
    .trim()
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID"),
];


export const getOrderDetailsValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Order ID"),
];

export const cancelOrderValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Order ID"),
];