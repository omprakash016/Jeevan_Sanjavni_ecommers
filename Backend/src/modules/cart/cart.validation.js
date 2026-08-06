import { body ,param } from "express-validator";

export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];



export const updateCartValidation = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid Product ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];



export const removeCartItemValidation = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid Product ID"),
];